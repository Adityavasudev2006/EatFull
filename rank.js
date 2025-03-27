
const itemRanking = [
    'pizza',            // Example: Pizza is ranked highest
    'chicken-biryani',
    'momos',
    'vada-pav',

    'meals',
    'dosa',
    'paneer-tikka',
    'grilled-chicken',
    'japanese-noodles',
    'italian-prawn-fry',

    'vada',
    'murukku',
    'puffs',
    'pulka-rotti',
    'veggie-salad',
    'blue-lagoon',
    'butter-scotch',
    'strawberry-pie',
    'sweets-jumbo',
    'mango-pickle',

];

function applyRanking() {
    const container = document.getElementById('itemContainer');
    if (!container) {
        console.error('Error: Item container with ID "itemContainer" not found.');
        return;
    }

    const allCards = container.querySelectorAll('.item-card');
    if (allCards.length === 0) {
        console.warn('No item cards found to rank.');
        return;
    }

    const cardMap = new Map();
    allCards.forEach(card => {
        const id = card.dataset.id; 
        if (id) {
            cardMap.set(id, card);
        } else {
            console.warn('Card found without a data-id:', card);
        }
    });

    const fragment = document.createDocumentFragment();
    const rankedIds = new Set(); // Keep track of items we've already ranked

    itemRanking.forEach(rankedId => {
        const card = cardMap.get(rankedId);
        if (card) {
            fragment.appendChild(card); 
            rankedIds.add(rankedId); 
        } else {
            console.warn(`Warning: Card with data-id "${rankedId}" listed in ranking but not found in HTML.`);
        }
    });

    cardMap.forEach((card, id) => {
        if (!rankedIds.has(id)) {
            fragment.appendChild(card); // Append moves the element
        }
    });

    container.appendChild(fragment);

    console.log('Item ranking applied.');
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyRanking);
} else {
    applyRanking();
}