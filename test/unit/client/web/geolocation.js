describe("w3c_geolocation", function () {
    var w3c = "w3c/1.0/",
        web = "ripple/client/platform/web/default/",
        spec = require(web  + 'spec'),
        ui = require(web  + 'spec/ui');

    describe("spec", function () {
        it("includes require modules", function () {
            expect(spec.objects.Coordinates.path).toEqual(w3c + "Coordinates");
            expect(spec.objects.Position.path).toEqual(w3c + "Position");
            expect(spec.objects.PositionError.path).toEqual(w3c + "PositionError");
            expect(spec.objects.navigator.children.geolocation.path).toEqual(w3c + "geolocation");
        });

        describe("ui", function () {
            it("uses web/spec/ui module", function () {
                expect(spec.ui.plugins).toEqual(ui.plugins);
            });

            it("includes geoView plugin", function () {
                function includesGeoViewPlugin() {
                    return ui.plugins.some(function (plugin) {
                        return plugin === "geoView";
                    });
                }

                expect(includesGeoViewPlugin()).toBe(true);
            });
        });
    });
});
