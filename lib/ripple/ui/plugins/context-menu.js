/*
 *  Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var touchEventEmulator = require('ripple/touchEventEmulator'),
    MAX_NUM_ITEMS_IN_PORTRAIT_PEEK_MODE = 7,
    MAX_NUM_ITEMS_IN_LANDSCAPE_PEEK_MODE = 3,
    PEEK_MODE_TRANSLATE_X = -121,
    FULL_MENU_TRANSLATE_X = -569,
    HIDDEN_MENU_TRANSLATE_X = 0,
    MENU_ITEM_HEIGHT = 121,
    state = {
        HIDE: 0,
        PEEK: 1,
        VISIBLE: 2,
        DRAGEND: 3
    },
    maxNumItemsInPeekMode = MAX_NUM_ITEMS_IN_PORTRAIT_PEEK_MODE,
    menuCurrentState = state.HIDE,
    touchMovedOnMenu = false,
    touchMovedOnBody = false,
    numItems = 0,
    peekModeNumItems = 0,
    dragStartPoint,
    currentTranslateX,
    menu,
    contextMenuContent,
    contextMenuHandle,
    contextMenuDelete,
    headText,
    subheadText,
    currentPeekIndex,
    previousPeekIndex,
    elements,
    modal,
    menuPageY,
    isMouseDown = false,
    self;

function getMenuXTranslation() {
    if (menuCurrentState === state.PEEK) {
        return PEEK_MODE_TRANSLATE_X;
    }
    if (menuCurrentState === state.VISIBLE) {
        return FULL_MENU_TRANSLATE_X;
    }
    return HIDDEN_MENU_TRANSLATE_X;
}

function positionHandle() {
    var moreIcon = document.getElementById('moreHandleIcon'),
        top;

    if (menuCurrentState === state.PEEK) {
        contextMenuHandle.className = 'showContextMenuHandle';
        top = (window.screen.availHeight + (peekModeNumItems - 1) * MENU_ITEM_HEIGHT) / 2;
        contextMenuHandle.style.top = top + 'px';

        // If have more options than the limit, show the more dots on the contextMenuHandle
        if (numItems > maxNumItemsInPeekMode) {
            contextMenuContent.style.top = '-75px';
            if (moreIcon === null) {
                moreIcon = document.createElement('img');
                moreIcon.id = "moreHandleIcon";
                moreIcon.style = 'showMoreHandleIcon';
                moreIcon.src = jQuery("#extension-url").text() + 'images/ActionOverflowMenu.png';
                moreIcon.className = 'showMoreHandleIcon';
                contextMenuHandle.appendChild(moreIcon);
            }
        } else {
            contextMenuContent.style.top = '';
            if (numItems <= maxNumItemsInPeekMode && moreIcon !== null) {
                contextMenuHandle.removeChild(moreIcon);
            }
        }
    } else if (menuCurrentState === state.VISIBLE) {
        if (numItems <= maxNumItemsInPeekMode) {
            contextMenuContent.style.top = '';
            contextMenuHandle.className = 'showContextMenuHandle';
            top = (window.screen.availHeight + (numItems - 1) * MENU_ITEM_HEIGHT) / 2;
            contextMenuHandle.style.top = top + 'px';
        } else {
            contextMenuHandle.className = 'hideContextMenuHandle';
        }
    }
}

function menuDragStart() {
    menu.style.webkitTransitionDuration = '0s';
    menu.style.overflowX = 'hidden';
    menu.style.overflowY = 'scroll';
}

function menuDragMove(pageX) {
    var x = window.screen.width + getMenuXTranslation() + pageX - dragStartPoint,
        menuWidth = -FULL_MENU_TRANSLATE_X;
    // Stop translating if the full menu is on the screen
    if (x >= window.screen.width - menuWidth) {
        currentTranslateX = getMenuXTranslation() + pageX - dragStartPoint;
        menu.style.webkitTransform = 'translate(' + currentTranslateX + 'px' + ', 0)';
    }
}

function menuDragEnd() {
    menu.style.webkitTransitionDuration = '0.25s';

    menuCurrentState = state.DRAGEND;
    if (currentTranslateX > PEEK_MODE_TRANSLATE_X) {
        self.hideContextMenu();
    } else if (currentTranslateX < FULL_MENU_TRANSLATE_X / 2) {
        self.showContextMenu();
    } else {
        self.peekContextMenu();
    }

    menu.style.webkitTransform = '';
}

function menuTouchStartHandler(evt) {
    isMouseDown = true;
    evt.stopPropagation();
    menuDragStart();
    dragStartPoint = evt.pageX;
}

function bodyTouchStartHandler(evt) {
    isMouseDown = true;
    dragStartPoint = evt.pageX;
    menuDragStart();
}

function getMenuItemAtPosition(currentYPosition, elementHeight) {
    /*jshint bitwise: false */
    if (currentYPosition >= contextMenuContent.offsetTop && currentYPosition <= contextMenuContent.offsetTop + contextMenuContent.clientHeight) {
        return (currentYPosition - contextMenuContent.offsetTop) / elementHeight | 0;
    }

    if (currentYPosition > contextMenuDelete.offsetTop) {
        return elements.length - 1;
    }
    return -1;
}

function menuTouchMoveHandler(evt) {
    var currentYPosition,
        currentPeekIndex,
        elementHeight,
        i;

    evt.stopPropagation();

    // Clear folded menu items if we are out of menu item bounds
    elementHeight = evt.currentTarget.clientHeight + 2; // border = 2
    currentYPosition = evt.clientY - menuPageY;
    currentPeekIndex = getMenuItemAtPosition(currentYPosition, elementHeight);

    if (currentPeekIndex < 0) {
        for (i = 0; i < elements.length; i += 1) {
            elements[i].className = 'contextmenuItem';
            elements[i].active = false;
        }
    }

    if (!isMouseDown) {
        return;
    }

    touchMovedOnMenu = true;

    menuDragMove(evt.pageX);
}

function bodyTouchMoveHandler(evt) {
    if (!isMouseDown) {
        return;
    }
    touchMovedOnBody = true;
    menuDragMove(evt.pageX);
}

function menuTouchEndHandler(evt) {
    isMouseDown = false;
    evt.stopPropagation();

    if (touchMovedOnMenu) {
        touchMovedOnMenu = false;
        menuDragEnd();
    } else {
        if (menuCurrentState === state.PEEK) {
            self.showContextMenu();
        } else if (menuCurrentState === state.VISIBLE) {
            self.peekContextMenu();
        }
    }
}

function bodyTouchEndHandler(evt) {
    isMouseDown = false;
    if (touchMovedOnBody) {
        touchMovedOnBody = false;
        menuDragEnd();
    }
    else {
        self.hideContextMenu();
    }
}

function highlightMenuItem(item) {
    if (menuCurrentState === state.PEEK) {
        item.className = 'contextmenuItem showContextmenuItem';
        item.active = true;
    } else if (menuCurrentState === state.VISIBLE) {
        item.className = 'contextmenuItem fullContextmenuItem';
        item.active = true;
    }
}

function menuItemTouchStartHandler(evt) {
    isMouseDown = true;
    evt.stopPropagation();
    highlightMenuItem(evt.currentTarget);
    previousPeekIndex = currentPeekIndex = evt.currentTarget.index;
}

function menuItemTouchMoveHandler(evt) {
    evt.stopPropagation();

    var previousPeek = elements[previousPeekIndex],
        currentYPosition = evt.clientY - menuPageY,
        elementHeight = evt.currentTarget.clientHeight + 2; // border = 2

    currentPeekIndex = getMenuItemAtPosition(currentYPosition, elementHeight);
    if (currentPeekIndex === previousPeekIndex) {
        return;
    }
    if (currentPeekIndex === -1) {
        if (previousPeek && previousPeek.active) {
            previousPeek.className = 'contextmenuItem';
            previousPeek.active = false;
        }
    } else if (previousPeekIndex === -1) {
        highlightMenuItem(elements[currentPeekIndex]);
    } else {
        if (previousPeek && previousPeek.active) {
            previousPeek.className = 'contextmenuItem';
            previousPeek.active = false;
        }
        highlightMenuItem(elements[currentPeekIndex]);
    }
    previousPeekIndex = currentPeekIndex;
}

function menuItemTouchEndHandler(evt) {
    isMouseDown = false;
    evt.stopPropagation();
    if (currentPeekIndex !== -1) {
        var element = elements[currentPeekIndex];

        if (element) {
            element.className = 'contextmenuItem';
            element.active = false;
        }

        // window.qnx.webplatform.getController().remoteExec(1, 'executeMenuAction', [element.attributes.actionId.value]);
        self.hideContextMenu();
    }
}

function rotationHandler() {
    if (window.orientation === 0 || window.orientation === 180) {
        maxNumItemsInPeekMode = MAX_NUM_ITEMS_IN_PORTRAIT_PEEK_MODE;
    } else {
        maxNumItemsInPeekMode = MAX_NUM_ITEMS_IN_LANDSCAPE_PEEK_MODE;
    }
    self.hideContextMenu();
}

function handleMouseDown(evt) {
    evt.preventDefault();
    evt.stopPropagation();
}

function setHeadText(text) {
    var headTextElement = document.getElementById('contextMenuHeadText');
    headTextElement.innerText = text;

    if (text) {
        if (!subheadText || subheadText === '') {
            headTextElement.style.height = '105px';
            headTextElement.style.lineHeight = '105px';
        } else {
            headTextElement.style.height = '60px';
            headTextElement.style.lineHeight = '60px';
        }

    } else {
        headTextElement.style.height = '0px';
    }
}

function setSubheadText(text) {
    var subheadTextElement = document.getElementById('contextMenuSubheadText');
    subheadTextElement.innerText = text;

    if (text) {
        if (!headText || headText === '') {
            subheadTextElement.style.height = '105px';
            subheadTextElement.style.lineHeight = '105px';
        } else {
            subheadTextElement.style.height = '60px';
            subheadTextElement.style.lineHeight = '60px';
        }
    } else {
        subheadTextElement.style.height = '0px';
    }
}

function resetHeader() {
    var header = document.getElementById('contextMenuHeader');

    // Always hide the header div whenever we are peeking
    if (headText || subheadText) {
        header = document.getElementById('contextMenuHeader');
        header.className = '';
        if (headText) {
            setHeadText('');
        }
        if (subheadText) {
            setSubheadText('');
        }
    }
}

function resetMenuContent() {
    contextMenuContent.style.position = '';
    contextMenuContent.style.top = '';
    contextMenuContent.style.height = '';
    contextMenuContent.style.overflowY = '';
}

function init() {
    menu = document.getElementById('contextMenu');
    menu.addEventListener('webkitTransitionEnd', self.transitionEnd.bind(self));
    menu.addEventListener('mousedown', menuTouchStartHandler);
    menu.addEventListener('mousemove', menuTouchMoveHandler);
    menu.addEventListener('mouseup', menuTouchEndHandler);
    menuPageY = $(menu).offset().top;
    contextMenuContent = document.getElementById('contextMenuContent');
    contextMenuDelete = document.getElementById('contextMenuDelete');
    contextMenuHandle = document.getElementById('contextMenuHandle');
    modal = document.getElementById('contextMenuModal');
    setHeadText('');
    setSubheadText('');
    rotationHandler();
    window.addEventListener('orientationchange', rotationHandler, false);

    // document.addEventListener('mousedown', handleMouseDown, false);
}

function buildMenuItem(options) {
    var menuItem,
        menuImage,
        imageUrl = options.imageUrl || options.icon || jQuery("#extension-url").text() + 'images/generic_81_81_placeholder.png';

    menuItem = document.createElement('div');

    menuImage = document.createElement('img');
    menuImage.src = imageUrl;
    menuImage.setAttribute('width', '81');
    menuImage.setAttribute('height', '81');
    menuItem.appendChild(menuImage);
    menuItem.appendChild(document.createTextNode(options.label));
    menuItem.setAttribute("class", "contextmenuItem");

    menuItem.setAttribute("actionId", options.actionId);
    menuItem.index = numItems;
    menuItem.active = false;
    // menuItem.addEventListener('mousedown', handleMouseDown, false);
    menuItem.addEventListener('mousedown', menuItemTouchStartHandler);
    menuItem.addEventListener('mousemove', menuItemTouchMoveHandler);
    menuItem.addEventListener('mouseup', menuItemTouchEndHandler);

    if (options.isDelete || options.actionId === 'Delete') {
        menuItem.isDelete = true;
    }

    return menuItem;
}

self = {
    init: init,
    handleMouseDown: handleMouseDown,
    setMenuOptions: function (options) {
        var menuItem,
            deleteMenuItem,
            i;

        for (i = 0; i < options.length; i++) {
            if (options[i].headText || options[i].subheadText) {
                if (options[i].headText) {
                    headText = options[i].headText;
                }
                if (options[i].subheadText) {
                    subheadText = options[i].subheadText;
                }
                continue;
            }

            menuItem = buildMenuItem(options[i]);

            if (menuItem.isDelete) {
                while (contextMenuDelete.firstChild) {
                    contextMenuDelete.removeChild(contextMenuDelete.firstChild);
                }
                contextMenuDelete.appendChild(menuItem);
                deleteMenuItem = buildMenuItem(options[i]);
                deleteMenuItem.setAttribute('class', 'hideContextMenuItem');
                contextMenuContent.appendChild(deleteMenuItem);
            } else {
                if (numItems >= maxNumItemsInPeekMode) {
                    menuItem.setAttribute('class', 'hideContextMenuItem');
                }
                contextMenuContent.appendChild(menuItem);
            }

            numItems++;
        }
    },

    showContextMenu: function (evt) {
        var i,
            header,
            items;

        if (menuCurrentState === state.VISIBLE) {
            return;
        }
        menu.style.webkitTransitionDuration = '0.25s';
        menu.className = 'showContextMenu';
        contextMenuContent.className = 'contentShown';
        contextMenuHandle.className = 'showContextMenuHandle';

        if (evt) {
            evt.preventDefault();
            evt.stopPropagation();
        }

        // Show header
        if (headText || subheadText) {
            header = document.getElementById('contextMenuHeader');
            header.className = 'showMenuHeader';
            if (headText) {
                setHeadText(headText);
            }
            if (subheadText) {
                setSubheadText(subheadText);
            }
            // Move content so that menu items won't be covered by header
            if (numItems > maxNumItemsInPeekMode) {
                contextMenuContent.style.position = 'absolute';
                contextMenuContent.style.top = '131px';
            }
        }

        // Move content so that menu items won't be covered by header
        // And scale the height to be 80% for scrolling if we have more numItems
        if (numItems > maxNumItemsInPeekMode) {
            contextMenuContent.style.position = 'absolute';
            contextMenuContent.style.top = (headText || subheadText) ? '131px' : '0px';
            contextMenuContent.style.height = (headText || subheadText) ? '80%': '100%';
            contextMenuContent.style.overflowY = 'scroll';
            contextMenuContent.scrollTop = 0;
        }

        items = contextMenuContent.childNodes;

        if (items.length > maxNumItemsInPeekMode) {
            for (i = 0; i < items.length; i += 1) {
                items[i].className = 'contextmenuItem';
            }
            contextMenuDelete.style.webkitTransitionDuration = '0.25s';
            contextMenuDelete.className = 'hideContextMenuDelete';
        }

        menuCurrentState = state.VISIBLE;
        positionHandle();
    },

    isMenuVisible: function () {
        return menuCurrentState === state.PEEK || menuCurrentState === state.VISIBLE;
    },

    hideContextMenu: function (evt) {
        if (menuCurrentState === state.HIDE) {
            return;
        }
        numItems = 0;
        menu.style.webkitTransitionDuration = '0.25s';
        menu.className = 'hideMenu';

        menu.removeEventListener('mousedown', menuTouchStartHandler, false);
        menu.removeEventListener('mousemove', menuTouchMoveHandler, false);
        menu.removeEventListener('mouseup', menuTouchEndHandler, false);

        window.document.body.removeEventListener('mousedown', bodyTouchStartHandler, false);
        window.document.body.removeEventListener('mousemove', bodyTouchMoveHandler, false);
        window.document.body.removeEventListener('mouseup', bodyTouchEndHandler, false);

        while (contextMenuContent.firstChild) {
            contextMenuContent.removeChild(contextMenuContent.firstChild);
        }
        contextMenuContent.style.position = '';
        contextMenuContent.style.top = '';

        // window.qnx.webplatform.getController().remoteExec(1, 'webview.notifyContextMenuCancelled');
        if (evt) {
            evt.preventDefault();
            evt.stopPropagation();
        }
        menuCurrentState = state.HIDE;
        modal.style.display = 'none';

        // Hide the context header in case it was open
        document.getElementById('contextMenuHeader').className = '';

        // Reset sensitivity
        // window.qnx.webplatform.getController().remoteExec(1, 'webview.setSensitivity', ['SensitivityTest']);
    },

    setHeadText: setHeadText,

    setSubheadText: setSubheadText,

    peekContextMenu: function (show, zIndex) {
        if (menuCurrentState === state.PEEK) {
            return;
        }
        peekModeNumItems = numItems > maxNumItemsInPeekMode ? maxNumItemsInPeekMode : numItems;
        elements = document.getElementsByClassName("contextmenuItem");
        var items,
            i;

        // Cache items for single item peek mode.
        // window.qnx.webplatform.getController().remoteExec(1, 'webview.setSensitivity', ['SensitivityAlways']);
        menu.style.webkitTransitionDuration = '0.25s';
        menu.className = 'peekContextMenu';
        contextMenuHandle.className = 'showContextMenuHandle';
        if ((menuCurrentState === state.DRAGEND || menuCurrentState === state.VISIBLE)) {

            items = contextMenuContent.childNodes;

            if (items.length > maxNumItemsInPeekMode) {
                for (i = maxNumItemsInPeekMode; i < items.length; i += 1) {
                    items[i].className = 'hideContextMenuItem';
                }
            }

            // hide delete menu item
            for (i = 0; i < items.length; i += 1) {
                if (items[i].isDelete) {
                    items[i].className = 'hideContextMenuItem';
                }
            }
        }

        contextMenuDelete.style.webkitTransitionDuration = '0s';
        contextMenuDelete.className = '';

        resetHeader();
        resetMenuContent();

        // This is for single item peek mode
        menu.style.overflowX = 'visible';
        menu.style.overflowY = 'visible';

        window.document.body.addEventListener('mousedown', bodyTouchStartHandler);
        window.document.body.addEventListener('mousemove', bodyTouchMoveHandler);
        window.document.body.addEventListener('mouseup', bodyTouchEndHandler);

        modal.style.display = '';

        menuCurrentState = state.PEEK;
        positionHandle();
    },

    transitionEnd: function () {
        if (menuCurrentState === state.HIDE) {
            self.setHeadText('');
            self.setSubheadText('');
            headText = '';
            subheadText = '';
        }
    }
};

module.exports = self;
