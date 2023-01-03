const broadcast = new BroadcastChannel("quote_channel");
const quote = document.querySelector("#quote");


const quotePlaceHolder = document.querySelector("#quote");
const shareQuote = document.querySelector("#share-quote");

broadcast.onmessage = ({data}) => {
    quotePlaceHolder.innerHTML = data;
    quote.innerHTML = data;
};

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

const shareData = async (data) => {
    try {
        await navigator.share(data);
    } catch (error) {
        console.error(error);
    }
}
