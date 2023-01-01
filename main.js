import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <video autoplay muted playsinline id="video" width="320">
        <source src="/sample-5s.mp4" />
    </video>
    <div id="quote"></div>
    <button type="button" id="share-quote">Share quote</button>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'));

const video = document.querySelector("#video");
const quotePlaceHolder = document.querySelector("#quote");
const shareQuote = document.querySelector("#share-quote");

const shareData = async (data) => {
    try {
        await navigator.share(data);
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        video.play();
    } else {
        video.pause();
    }
});

shareQuote.addEventListener('click', () => {
    shareData({
        title: "A nice quote",
        url: location.href,
        text: quotePlaceHolder.textContent
    }).then(res => {
        console.log(res)
    }).catch(error => {
        console.error(error)
    })
});

const channel = new BroadcastChannel("quote_channel");

const getQuote = endpoint => {
    return async function* (quotes = 5) {
        let count = quotes;
        while(count) {
            const response = await fetch(`https://api.quotable.io/${endpoint}`);
            const quote = await response.json();
            yield quote;
            count--;
        }
    }
}

const getRandomQuote = getQuote("random");
const getFiveQuotes = getRandomQuote();
const quotes = [];

for await (const quote of getFiveQuotes) {
    quotes.push(quote);
}

let clone = Array.from(quotes);

const addQuote = () => {
    if (document.visibilityState === 'hidden') {
        return;
    }
    const {content, author, dateAdded} = clone.shift();
    quotePlaceHolder.innerHTML = `<blockquote>${content}</blockquote><cite>${author}</cite><time datetime="${dateAdded}">${dateAdded}</time>`;
    channel.postMessage(`A new quote with has been posted to the channel. ${content} Author: ${author}`)
    if (!clone.length) {
        clone = Array.from(quotes);
    }
};

setInterval(addQuote, 2000);
