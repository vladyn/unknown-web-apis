const broadcast = new BroadcastChannel("quote_channel");
const quote = document.querySelector("#quote");

broadcast.onmessage = ({data}) => {
    quote.innerHTML = data;
};
