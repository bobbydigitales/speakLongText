let text = `SEMANTIC COMPRESSION
2014-05-28 — The Witness
By 	CASEY MURATORI     
We all know how to program in C++, don’t we? I mean, we’ve all read a selection of wonderful books by the gaggle of bearded fellows who defined the language in the first place, so we’ve all learned the best ways to write C++ code that solves real-world problems.
First, you look at the real world problem  —  say, a payroll system  —  and you see that it has some plural nouns in it: “employees”, “managers”, etc. So the first thing you need to do is make classes for each of these nouns. There should be an employee class and a manager class, at least.
But really, both of those are just people. So we probably need a base class called “person”, so that things in our program that don’t care whether you’re an employee or a manager can just treat you as a person. This is very humanizing, and makes the other classes feel less like cogs in a corporate machine!
There’s a bit of a problem, though. Isn’t a manager also an employee? So manager should probably inherit from employee, and then employee can inherit from person. Now we’re really getting somewhere! We haven’t actually thought about how to write any code, sure, but we’re modeling the objects that are involved, and once we have those solid, the code is just going to write itself.
Wait, shoot  —  you know what? I just realized, what if we have contractors? We definitely need a contractor class, because they are not employees. The contractor class could inherit from the person class, because all contractors are people (aren’t they?). That would be totally sweet.
But then what does the manager class inherit from? If it inherits from the employee class, then we can’t have managers who work on contract. If it inherits from the contractor class, then we can’t have full-time managers. This is turning out to be a really hard programming problem, like the Simplex algorithm or something!
OK, we could have manager inherit from both classes, and then just not use one of them. But that’s not type-safe enough. This isn’t some sloppy JavaScript program! But you know what? BAM! I’ve got the solution right here: we templatize the manager class. We templatize the manager class on its base class, and then everything that works with manager classes is templatized on that as well!
This is going to be the best payroll system ever! As soon as I get all these classes and templates spec’d out, I’m going to fire up my editor and get to work on the UML diagrams.It’d be great if everything I just wrote had been farcical, but sadly, there’s actually a lot of programmers in the world who think like this. I’m not talking about “Bob the Intern”  —  I’m talking about all kinds of programmers, including famous programmers who give lectures and write books. I am also sad to say that there was a time in my life when I thought this way, too. I was introduced to “object oriented programming” when I was 18, and it took me until I was about 24 to realize it was all a load of horseshit (and the realization was thanks in no small part to my taking a job with RAD Game Tools, which thankfully never bought into the whole OOP nightmare).
But despite the fact that many programmers out there have gone through bad phases like this and eventually come to smart conclusions about how to actually write good code efficiently, it seems that the landscape of educational materials out there still overwhelmingly falls into the “objectively bad” category. I suspect this has something to do with the fact that good programming seems very straightforward once you know how to do it, unlike, say, a fancy math technique that retains its sexiness and makes you want to spend the time to post about it. So, although I don’t have any data to back this up, I strongly suspect that experienced programmers rarely spend time posting about how they program because they just don’t think it’s anything special.
But they should! It may not be special, but it’s necessary, and if good programmers don’t start posting about how to do good programming, we’ll never get out of this nasty place where everyone has to go through six years of writing horrible object-oriented programs before they realize they’re wasting their time. So what I’d like to do with this next set of Witness articles is spend some serious word count talking about the purely mechanical process of putting code into a computer, and it is my sincere hope that other experienced programmers out there will take some time to do the same. Personally, I’d love to read more about the techniques actual good programmers out there use when they sit down to code.
To start things off, I am going to detail a straightforward set of code transformations that I did on The Witness’s editor code. In the coming weeks, I’ll move from that into some larger examples where I wrote more pieces from scratch, but the entire time I’ll be focusing solely on code and how it’s structured. Nothing that I’m going to cover has any fancy algorithms or math or anything, it’s all just pure plumbing.In the built-in editor for The Witness, there is a piece of UI called the “Movement Panel”. It is a floating window with some buttons on it that are used to perform operations on entities like “rotate 90 degrees”. Originally it was quite small and had only a few buttons, but when I started working on the editor, I added a bunch of features that needed to go in the movement panel. This was going to expand its contents considerably, and it meant I had to learn how to add elements to the UI, which I’d never done before. I examined the existing code, which looked like this:The first thing I noticed here was that Jon, the original programmer, did a really nice job setting me up for success with what I was about to do. A lot of times, you open up some code for something simple like this, and you find that it is just a massive tangle of unnecessary structure and indirection. Here, instead, we find an extremely straightforward series of things happening, that read exactly like how you would instruct a person to draw a UI panel: “First, figure out where the title bar should go. Then, draw the title bar. Now, below that, draw the Auto Snap button. If it’s pressed, do auto snapping…” This is exactly how programming should go. I suspect that most anyone could read this code and know what it was doing, and probably intuit how to add more buttons without having to read anything beyond just this excerpt.
However, nice as the code was, it was obviously not set up for doing large amounts of UI, because all the layout work was still being done by hand, in-line. This is mildly inconvenient in the snippet above, but gets more onerous once you consider more complex layouts, like this piece of the UI that has four separate buttons that occur on the same row:So, before I started adding lots of new buttons, I already felt like I should spend a little time working on the underlying code to make it simpler to add new things. Why did I feel that way, and how did I know what “simpler” means in this case?I look at programming as having essentially two parts: figuring out what the processor actually needs to do to get something done, and then figuring out the most efficient way to express that in the language I’m using. Increasingly, it is the latter that accounts for what programmers actually spend their time on: wrangling all those algorithms and all that math into a coherent whole that doesn’t collapse under its own weight.
So any experienced programmer who’s any good has had to come up with some way  —  if even just by intuition  —  of thinking about what it means to program efficiently. By “efficiently”, this doesn’t just mean that the code is optimized. Rather, it means that the development of the code is optimized  —  that the code is structured in such a way so as to minimize the amount of human effort necessary to type it, get it working, modify it, and debug it enough for it to be shippable.
I like to think of efficiency as holistically as possible. If you look at the development process for a piece of code as a whole, you won’t overlook any hidden costs. Given a certain level of performance and quality required by the places the code gets used, beginning at its inception and ending with the last time the code is ever used by anyone for any reason, the goal is to minimize the amount of human effort it cost. This includes the time to type it in. It includes the time to debug it. It includes the time to modify it. It includes the time to adapt it for other uses. It includes any work done to other code to get it to work with this code that perhaps wouldn’t have been necessary if the code were written differently. All work on the code for its entire usable lifetime is included.
When considered in this way, my experience has led me to conclude that the most efficient way to program is to approach your code as if you were a dictionary compressor. Like, literally, pretend you were a really great version of PKZip, running continuously on your code, looking for ways to make it (semantically) smaller. And just to be clear, I mean semantically smaller, as in less duplicated or similar code, not physically smaller, as in less text, although the two often go hand-in-hand.
This is a very bottom-up programming methodology, a pseudo-variant of which has recently gained the monicker “refactoring”, even though that is a ridiculous term for a number of reasons that are not worth belaboring at the moment. I also think that the formal “refactoring” stuff missed the main point, but that’s also not worth belaboring. Point being, they are sort-of related, and hopefully you will understand the similarities and differences more over the course of this article series.
So what does compression-oriented programming look like, and why is it efficient?
Like a good compressor, I don’t reuse anything until I have at least two instances of it occurring. Many programmers don’t understand how important this is, and try to write “reusable” code right off the bat, but that is probably one of the biggest mistakes you can make. My mantra is, “make your code usable before you try to make it reusable”.
I always begin by just typing out exactly what I want to happen in each specific case, without any regard to “correctness” or “abstraction” or any other buzzword, and I get that working. Then, when I find myself doing the same thing a second time somewhere else, that is when I pull out the reusable portion and share it, effectively “compressing” the code. I like “compress” better as an analogy, because it means something useful, as opposed to the often-used “abstracting”, which doesn’t really imply anything useful. Who cares if code is abstract?
Waiting until there are (at least) two examples of a piece of code means I not only save time thinking about how to reuse it until I know I really need to, but it also means I always have at least two different real examples of what the code has to do before I try to make it reusable. This is crucial for efficiency, because if you only have one example, or worse, no examples (in the case of code written preemptively), then you are very likely to make mistakes in the way you write it and end up with code that isn’t conveniently reusable. This leads to even more wasted time once you go to use it, because either it will be cumbersome, or you will have to redo it to make it work the way you need it to. So I try very hard to never make code “prematurely reusable”, to evoke Knuth.
Similarly, like a magical globally optimizing compressor (which sadly PKZip isn’t), when you are presented with new places where a previously reused piece of code could be reused again, you make a decision: if the reusable code is already suitable, you just use it, but if it’s not, you decide whether or not you should modify how it works, or whether you should introduce a new layer on top of or underneath it. Multiresolution entry points are a big part of making code resuable, but I’ll save discussion of that for a later article, since it’s a topic unto itself.
Finally, the underlying assumption in all of this is, if you compress your code to a nice compact form, it is easy to read, because there’s a minimal amount of it, and the semantics tend to mirror the real “language” of the problem, because like a real language, those things that are expressed most often are given their own names and are used consistently. Well-compressed code is also easy to maintain, because all the places in the code that are doing identical things all go through the same paths, but code that is unique is not needlessly complicated or separated from its use. Finally, well-compressed code is easy to extend, because producing more code that does similar operations is simple, as all the necessary code is there in a nicely recomposable way.
These are all things that most programming methodologies claim to do in an abstract fashion (build UML diagrams, make class hierarchies, make systems of objects, etc.), but always fail to achieve, because the hard part of code is getting the details right. Starting from a place where the details don’t exist inevitably means you will forget or overlook something that will cause your plans to fail or lead to suboptimal results. Starting with the details and repeatedly compressing to arrive at the eventual architecture avoids all the pitfalls of trying to conceive the architecture ahead of time.
With all that in mind, let’s take a look at how all this can be applied to the simple Witness UI code.The first bit of code compression I did on the UI code happens to be one of my very favorites, since it’s trivial to do and yet is extremely satisfying.
Basically, in C++, functions are very selfish. They keep all their local variables to themselves, and you can’t really do anything about that (although as the cancerous C++ specification continues to metastasize, it’s starting to add more options for this, but that is a separate issue). So when I see code like the Witness UI code that’s doing stuff like this:I think it’s time for me to make a shared stack frame.
What I mean by this is, anywhere there’s going to be a panel UI in the Witness, this sort of thing is going to happen. I looked at the other panels in the editor, of which there were several, and they all had substantively the exact same code as I showed in the original snippet  —  same startup, same button calculations, etc. So it’s clear that I want to compress all this so that each thing only happens in one place, then just gets used by everyone else.
But it’s not really feasible to wrap what’s going on purely in a function, because there’s systems of variables that interact, and they interact in multiple places that need to connect with each other. So the first thing I did to this code was to pull those variables out into a structure that can serve as a sort of shared stack frame for all these operations if I want them to be separate functions:Simple, right? You just grab the variables that you see that are being used in a repetitive way, and you put them in a struct. Typically, I use InterCaps for variable names and lowercase_with_underscores for types, but since I am in the Witness codebase, I try to adhere to its general conventions where possible, and it uses Uppercase_With_Underscores for types and lowercase_with_underscores for variables.
After I substituted the structure in for the local variables, the code looked like this:Not an improvement yet, but it was a necessary first step. Next I pulled the redundant code out into functions: one at startup, and one for each time there’s a new row of UI. Normally, I would probably not make these member functions, but since The Witness is a more C++-ish codebase than my own, I thought it was more consistent with the style (and I don’t have a strong preference either way):Once I had the structure, it was also trivial to take these two linesfrom the original and wrap them up:So then the code looked like this:Although that wouldn’t be necessary if this was the only panel (since the code only happens once), all the Witness UI panels did the same thing, so pulling it out meant I could go compress all that code too (which I did, but which I won’t be covering here).
Things were looking better, but I also wanted to get rid of the weird “num_categories” bit and the height calculation. Looking at that code further, I determined that all it was really doing was pre-counting how high the panel would be after all the rows were used. Since there was no actual reason why this had to be set up front, I figured hey, why not do it after all the rows have been made, so I can just count how many actually got added rather than forcing the program to pre-declare that? That makes it less error prone, because the two cannot get out of sync. So I added a “complete” function that gets run at the end of a panel layout:I went back to the constructor and made sure I saved “top_y” as the starting y, so all I had to do was just subtract the two. Poof! No more need for the precalculation:The code was getting a lot more concise, but it was also clear from the often-repeated draw_big_text_button calls that there was plenty of compressibility left. So I took those out next:which left the code looking rather nice and compact:and I decided to pretty it up a bit by reducing some of the unnecessary verbosity:Ah! It’s like a breath of fresh air compared to the original, isn’t it? Look at how nice that looks! It’s getting close to the minimum amount of information necessary to actually define the unique UI of the movement panel, which is how we know we’re doing a good job of compressing. And adding new buttons is getting very simple  —  no more in-line math, just one call to make a row and another to make a button.
Now, I want to point out something really important. Did all that seem pretty straightforward? I’m guessing that there wasn’t anything in there where you were like, “oh my god, how did he DO that??” I’m hoping that every step was really obvious, and everyone could have easily done a similar set of steps if charged with just pulling out the common pieces of code into functions.
So, given that, what I want to point out is this: this is the correct way to give birth to “objects”. We made a real, usable bundle of code and data: the Panel_Layout structure and its member functions. It does exactly what we want, it fits perfectly, it’s really easy to use, it was trivial to design.
Contrast this with the absolute absurdity that you see in object-oriented “methodologies” that tell you to start writing things on index cards (like the “class responsibility collaborators” methodology), or breaking out Visio to show how things “interact” using boxes and lines that connect them. You can spend hours with these methodologies and end up more confused about the problem than when you started. But if you just forget all that, and write simple code, you can always create your objects after the fact and you will find that they are exactly what you wanted.
If you’re not used to programming like this, you may think I’m exaggerating, but you’ll just have to trust me, it’s true. I spend exactly zero time thinking about “objects” or what goes where. The fallacy of “object-oriented programming” is exactly that: that code is at all “object-oriented”. It isn’t. Code is procedurally oriented, and the “objects” are simply constructs that arise that allow procedures to be reused. So if you just let that happen instead of trying to force everything to work backwards, programming becomes immensely more pleasant.Because I needed to spend some time introducing the concept of compression-oriented programming, and also because I enjoy trashing object-oriented programming, this article is already very long despite only showing a small fraction of the code transformations I did to the Witness UI code. So I will save the next round for next week, where I’ll talk about handling that multi-button code I showed, and then how I started using the newly compressed UI semantics to start extending what the UI itself could do.`;

async function getPageText(url:string) {
    let response = await fetch(url);

    let content = await response.text();

    return content;
}

async function speakLongText(text:string) {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech is not supported in this browser!");
        return;
    }

    let splitMessageContent = text.match(/[^.!?:;]+[.!?:;]+/g) || [];

    if (splitMessageContent.length === 0) {
        return;
    }

    speakText(splitMessageContent)
    // outputElement.innerText = JSON.stringify(messages, null, 4);
}

async function speakText(messages, index = 0) {
    return new Promise<void>(async (resolve) => {
        if (index >= messages.length) {
            resolve();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(messages[index]);
        utterance.voice = voice;
        utterance.onend = () => {
            resolve(speakText(messages, index + 1));
        };

        speechSynthesis.speak(utterance);
    });
}

let voice: SpeechSynthesisVoice | null = null;
function selectVoice() {
    const voices = speechSynthesis.getVoices();
    voice = voices.filter(function (voice) { return voice.name === 'Google UK English Male'; })[0];
}

const SpeechRecognition = (globalThis as any).SpeechRecognition || globalThis.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-GB";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function listen() {
    return new Promise((resolve, reject) => {
        recognition.onresult = (event) => {
            const text = event.results[event.results.length - 1][0].transcript;
            resolve(text);
        };

        recognition.onerror = (event) => {
            reject(new Error("Error occurred in recognition: " + event.error));
        };

        recognition.start();
    });
}



async function main() {
    debugger;
    console.log("Hello TypeScript!");

    speechSynthesis.onvoiceschanged = selectVoice;

    // const inputField = document.getElementById('queryText') as HTMLTextAreaElement;
    // const submitButton = document.getElementById('submitButton') as HTMLInputElement;
    // const listenButton = document.getElementById('listenButton') as HTMLInputElement;


    // if (!(submitButton && inputField && listenButton)) {
    //     throw new Error(`Couldn't get elements!`)
    // }
    // submitButton.addEventListener('click', submitQuery);
    // listenButton.addEventListener('click', listenAndSubmitQuery)

    speakLongText(text);
}

main();