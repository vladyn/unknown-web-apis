import './style.css'
import javascriptLogo from './javascript.svg'
import {setupCounter} from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
  <video autoplay muted playsinline id="video" width="320px" height="200px">
        <source src="/sample-5s.mp4" />
  </video>
`

setupCounter(document.querySelector('#counter'));

const video = document.querySelector("#video");

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        video.play();
    } else {
        video.pause();
    }
});

const channel = new BroadcastChannel("quote_channel");

const getQuote = endpoint => {
    return async function* (quotes = 5) {
        let count = quotes;
        while (count) {
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
    const formattedDate = dateFormatter('BG-bg', dateAdded)
    channel.postMessage(`<blockquote>${content}</blockquote><cite>${author}</cite><time datetime="${dateAdded}">${formattedDate}</time>`)
    if (!clone.length) {
        clone = Array.from(quotes);
    }
};

setInterval(addQuote, 2000);

const dateFormatter = (locale, dateAdded) => {
    const fromDate = new Date(dateAdded);
    const dateFormat = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return dateFormat.format(fromDate);
};
