// url api alle kaarten "https://db.ygoprodeck.com/api/v7/cardinfo.php"
// api info "https://db.ygoprodeck.com/api-guide/"

function fetchRequest(url) {
    // Retourneert een promise object met de JSON response
    // omgezet naar 'native Javascript objects'
    return fetch(url).then(body => body.json());
}

class Card {
    constructor(id, name, card_images) {
        this._id = id;
        this._name = name;
        this._card_images = card_images;
        this._image_url = card_images[0].image_url;
    }

    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get card_images(){
        return this._card_images;
    }
    get image_url(){
        return this._image_url;
    }
}

class CardsRepository {
    constructor() {
        this._cards = [];
    }

    get cards() {
        return this._cards;
    }

    get randomCard(){
        return this._cards[Math.floor(Math.random() * this._cards.length)]
    }

    addCards(jsondata) {
        // Opvullen van de this._menus-array met Menu-objecten.
        this._cards = jsondata.map(
            card =>
                new Card(
                    card.id,
                    card.name,
                    card.card_images,
                    card.image_url
                )
        );
    }
}

class CardApp {
    constructor() {
        this.getData();

    }

    getData() {
        // Ophalen data en afbeelden initiële webpagina.
        //fetchRequest('data/all.json')
        fetchRequest('https://db.ygoprodeck.com/api/v7/cardinfo.php')
            .then(jsondata => {
                this._cardsRepository = new CardsRepository();
                this._cardsRepository.addCards(jsondata.data);
                this.toHtml(this._cardsRepository.cards[Math.floor(Math.random() * this._cardsRepository.cards.length)]);
            })
            .catch(rejectvalue => {
                console.log(rejectvalue);
            });
    }

    toHtml(card){
        const cardElement = document.getElementById("block");
        
        cardElement.insertAdjacentHTML(
            'beforeend',
            `
            <div class="center">
                <img src="${card.image_url}" class="rounded mx-auto d-block"> 
            </div>       
            `
        );
    }

}

function init() {
    const yugiohCardApp = new CardApp();
    const randomButton = document.getElementById('random');

    randomButton.onclick = () => {
        document.getElementById("block").innerHTML = '';
        yugiohCardApp.toHtml(yugiohCardApp._cardsRepository.randomCard);
    };
}

window.onload = init;
