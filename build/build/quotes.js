/*
 *  Copyright 2011 Research In Motion Limited.
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
var quotes = [
    "Programming today is a race between software engineers striving to build bigger and better idiot-proof programs, and the universe trying to build bigger and better idiots. So far, the universe is winning. - Rick Cook",
    "Lisp isn't a language, it's a building material. - Alan Kay.",
    "Walking on water and developing software from a specification are easy if both are frozen. - Edward V Berard",
    "They don't make bugs like Bunny anymore. - Olav Mjelde.",
    "A programming language is low level when its programs require attention to the irrelevant. - Alan J. Perlis.",
    "A C program is like a fast dance on a newly waxed dance floor by people carrying razors. - Waldi Ravens.",
    "I have always wished for my computer to be as easy to use as my telephone; my wish has come true because I can no longer figure out how to use my telephone. - Bjarne Stroustrup",
    "Computer science education cannot make anybody an expert programmer any more than studying brushes and pigment can make somebody an expert painter. - Eric S. Raymond",
    "Don't worry if it doesn't work right. If everything did, you'd be out of a job. - Mosher's Law of Software Engineering",
    "I think Microsoft named .Net so it wouldn't show up in a Unix directory listing. - Oktal",
    "Fine, Java MIGHT be a good example of what a programming language should be like. But Java applications are good examples of what applications SHOULDN'T be like. - pixadel",
    "Considering the current sad state of our computer programs, software development is clearly still a black art, and cannot yet be called an engineering discipline. - Bill Clinton",
    "The use of COBOL cripples the mind; its teaching should therefore be regarded as a criminal offense. - E.W. Dijkstra",
    "In the one and only true way. The object-oriented version of 'Spaghetti code' is, of course, 'Lasagna code'. (Too many layers). - Roberto Waltman.",
    "FORTRAN is not a flower but a weed -- it is hardy, occasionally blooms, and grows in every computer. - Alan J. Perlis.",
    "For a long time it puzzled me how something so expensive, so leading edge, could be so useless. And then it occurred to me that a computer is a stupid machine with the ability to do incredibly smart things, while computer programmers are smart people with the ability to do incredibly stupid things. They are, in short, a perfect match. - Bill Bryson",
    "In My Egotistical Opinion, most people's C programs should be indented six feet downward and covered with dirt. - Blair P. Houghton.",
    "When someone says: 'I want a programming language in which I need only say what I wish done', give him a lollipop. - Alan J. Perlis",
    "The evolution of languages: FORTRAN is a non-typed language. C is a weakly typed language. Ada is a strongly typed language. C++ is a strongly hyped language. - Ron Sercely",
    "Good design adds value faster than it adds cost. - Thomas C. Gale",
    "Python's a drop-in replacement for BASIC in the sense that Optimus Prime is a drop-in replacement for a truck. - Cory Dodt",
    "Talk is cheap. Show me the code. - Linus Torvalds",
    "Perfection [in design] is achieved, not when there is nothing more to add, but when there is nothing left to take away. - Antoine de Saint-Exupery",
    "C is quirky, flawed, and an enormous success. - Dennis M. Ritchie.",
    "In theory, theory and practice are the same. In practice, they're not. - Yoggi Berra",
    "You can't have great software without a great team, and most software teams behave like dysfunctional families. - Jim McCarthy",
    "PHP is a minor evil perpetrated and created by incompetent amateurs, whereas Perl is a great and insidious evil, perpetrated by skilled but perverted professionals. - Jon Ribbens",
    "Programming is like kicking yourself in the face, sooner or later your nose will bleed. - Kyle Woodbury",
    "Perl -- The only language that looks the same before and after RSA encryption. - Keith Bostic",
    "It is easier to port a shell than a shell script. - Larry Wall",
    "I invented the term 'Object-Oriented', and I can tell you I did not have C++ in mind. - Alan Kay",
    "Learning to program has no more to do with designing interactive software than learning to touch type has to do with writing poetry - Ted Nelson",
    "The best programmers are not marginally better than merely good ones. They are an order-of-magnitude better, measured by whatever standard: conceptual creativity, speed, ingenuity of design, or problem-solving ability. - Randall E. Stross",
    "If McDonalds were run like a software company, one out of every hundred Big Macs would give you food poisoning, and the response would be, 'We're sorry, here's a coupon for two more.'  - Mark Minasi",
    "Beware of bugs in the above code; I have only proved it correct, not tried it. - Donald E. Knuth.",
    "There has got to be a better way - Dan Silivestru",
    "Computer system analysis is like child-rearing; you can do grievous damage, but you cannot ensure success. - Tom DeMarco",
    "I don't care if it works on your machine! We are not shipping your machine! - Vidiu Platon.",
    "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code. - Christopher Thompson",
    "Measuring programming progress by lines of code is like measuring aircraft building progress by weight. - Bill Gates",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it. - Brian W. Kernighan.",
    "People think that computer science is the art of geniuses but the actual reality is the opposite, just many people doing things that build on each other, like a wall of mini stones. - Donald Knuth",
    "First learn computer science and all the theory. Next develop a programming style. Then forget all that and just hack. - George Carrette",
    "Most of you are familiar with the virtues of a programmer. There are three, of course: laziness, impatience, and hubris. - Larry Wall",
    "Most software today is very much like an Egyptian pyramid with millions of bricks piled on top of each other, with no structural integrity, but just done by brute force and thousands of slaves. - Alan Kay",
    "The trouble with programmers is that you can never tell what a programmer is doing until it's too late. - Seymour Cray",
    "To iterate is human, to recurse divine. - L. Peter Deutsch",
    "On two occasions I have been asked [by members of Parliament]: 'Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?' I am not able rightly to apprehend the kind of confusion of ideas that could provoke such a question. - Charles Babbage",
    "Most good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program. - Linus Torvalds",
    "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live. - Martin Golding",
    "There are two ways of constructing a software design. One way is to make it so simple that there are obviously no deficiencies. And the other way is to make it so complicated that there are no obvious deficiencies. - C.A.R. Hoare ",
    "The best thing about a boolean is even if you are wrong, you are only off by a bit. - Anonymous",
    "There are two ways to write error-free programs; only the third one works. - Alan J. Perlis",
    "A good programmer is someone who always looks both ways before crossing a one-way street. - Doug Linder",
    "In order to understand recursion, one must first understand recursion. - Anonymous"
];
module.exports = {
    random: function () {
        console.log(quotes[parseInt(Math.random() * (quotes.length - 1), 10)]);
    }
};
