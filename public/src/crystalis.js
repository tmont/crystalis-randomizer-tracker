((window) => {
    const document = window.document;

    const save = () => {
        const data = items.filter(item => item.locations.length > 0).map((item) => {
            return {
                name: item.name,
                locations: item.locations,
            }
        });
        localStorage.setItem('data', JSON.stringify(data));
    };

    const load = () => {
        const data = localStorage.getItem('data');
        if (!data) {
            return;
        }

        try {
            const items = JSON.parse(data);
            items.forEach((item) => {
                item.locations.forEach((locationName) => {
                    discoverItem(item.name, locationName);
                });
            });
        } catch (e) {
            console.error('failed to load data from localStorage', e);
        }
    };

    const makeItem = (name, imageSrc, group, max) => {
        return {
            name,
            imageSrc: `images/${imageSrc}`,
            group,
            max: max || 1,
            locations: [],
            el: null,
        };
    };

    const items = [
        makeItem('Battle Armor', 'armor/battleArmor.png', 'armor'),
        makeItem('Psycho Armor', 'armor/psychoArmor.png', 'armor'),
        makeItem('Mirrored Shield', 'shields/mirroredShield.png', 'armor'),
        makeItem('Sacred Shield', 'shields/sacredShield.png', 'armor'),
        makeItem('Psycho Shield', 'shields/psychoShield.png', 'armor'),

        makeItem('Sword of Wind', 'swords/swordOfWind.png', 'sword-wind'),
        makeItem('Ball of Wind', 'swords/ballOfWind.png', 'sword-wind'),
        makeItem('Tornado Bracelet', 'swords/tornadoBracelet.png', 'sword-wind'),

        makeItem('Sword of Fire', 'swords/swordOfFire.png', 'sword-fire'),
        makeItem('Ball of Fire', 'swords/ballOfFire.png', 'sword-fire'),
        makeItem('Flame Bracelet', 'swords/flameBracelet.png', 'sword-fire'),

        makeItem('Sword of Water', 'swords/swordOfWater.png', 'sword-water'),
        makeItem('Ball of Water', 'swords/ballOfWater.png', 'sword-water'),
        makeItem('Blizzard Bracelet', 'swords/blizzardBracelet.png', 'sword-water'),

        makeItem('Sword of Thunder', 'swords/swordOfThunder.png', 'sword-thunder'),
        makeItem('Ball of Thunder', 'swords/ballOfThunder.png', 'sword-thunder'),
        makeItem('Storm Bracelet', 'swords/stormBracelet.png', 'sword-thunder'),

        makeItem('Refresh', 'magic/refresh.png', 'magic'),
        makeItem('Paralysis', 'magic/paralysis.png', 'magic'),
        makeItem('Telepathy', 'magic/telepathy.png', 'magic'),
        makeItem('Teleport', 'magic/teleport.png', 'magic'),
        makeItem('Recover', 'magic/recover.png', 'magic'),
        makeItem('Barrier', 'magic/barrier.png', 'magic'),
        makeItem('Change', 'magic/change.png', 'magic'),
        makeItem('Flight', 'magic/flight.png', 'magic'),

        makeItem('Medical Herb', 'consumables/medicalHerb.png', 'consumables', 7),
        makeItem('Antidote', 'consumables/antidote.png', 'consumables', 4),
        makeItem('Lysis Plant', 'consumables/lysisPlant.png', 'consumables', 3),
        makeItem('Fruit of Power', 'consumables/fruitOfPower.png', 'consumables', 5),
        makeItem('Fruit of Lime', 'consumables/fruitOfLime.png', 'consumables', 1),
        makeItem('Fruit of Repun', 'consumables/fruitOfRepun.png', 'consumables', 2),
        makeItem('Magic Ring', 'consumables/magicRing.png', 'consumables', 8),
        makeItem('Warp Boots', 'consumables/warpBoots.png', 'consumables', 3),
        makeItem('Opel Statue', 'consumables/opelStatue.png', 'consumables', 3),

        makeItem('Gas Mask', 'wearables/gasMask.png', 'wearables'),
        makeItem('Power Ring', 'wearables/powerRing.png', 'wearables'),
        makeItem('Warrior Ring', 'wearables/warriorRing.png', 'wearables'),
        makeItem('Iron Necklace', 'wearables/ironNecklace.png', 'wearables'),
        makeItem('Deo\'s Pendant', 'wearables/deosPendant.png', 'wearables'),
        makeItem('Rabbit Boots', 'wearables/rabbitBoots.png', 'wearables'),
        makeItem('Leather Boots', 'wearables/leatherBoots.png', 'wearables'),
        makeItem('Shield Ring', 'wearables/shieldRing.png', 'wearables'),

        makeItem('Alarm Flute', 'eventables/alarmFlute.png', 'event-0'),
        makeItem('Insect Flute', 'eventables/insectFlute.png', 'event-0'),
        makeItem('Flute of Lime', 'eventables/fluteOfLime.png', 'event-0'),
        makeItem('Shell Flute', 'eventables/shellFlute.png', 'event-0'),

        makeItem('Statue of Onyx', 'eventables/statueOfOnyx.png', 'event-1'),
        makeItem('Broken Statue', 'eventables/brokenStatue.png', 'event-1'),
        makeItem('Ivory Statue', 'eventables/ivoryStatue.png', 'event-1'),

        makeItem('Bow of Moon', 'eventables/bowOfMoon.png', 'event-2'),
        makeItem('Bow of Sun', 'eventables/bowOfSun.png', 'event-2'),
        makeItem('Bow of Truth', 'eventables/bowOfTruth.png', 'event-2'),

        makeItem('Windmill Key', 'eventables/windmillKey.png', 'event-3'),
        makeItem('Key to Prison', 'eventables/keyToPrison.png', 'event-3'),
        makeItem('Key to Styx', 'eventables/keyToStyx.png', 'event-3'),

        makeItem('Fog Lamp', 'eventables/fogLamp.png', 'event-4'),
        makeItem('Glowing Lamp', 'eventables/glowingLamp.png', 'event-4'),

        makeItem('Eye Glasses', 'eventables/eyeGlasses.png', 'event-5'),
        makeItem('Kirisa Plant', 'eventables/kirisaPlant.png', 'event-5'),
        makeItem('Love Pendant', 'eventables/lovePendant.png', 'event-5'),

        makeItem('Mimic', 'traps/mimic-square.png', 'other', 12),
    ];

    const itemLocations = [
        {
            groupName: 'Leaf',
            locations: [
                { name: 'Leaf student', image: 'leaf-student' },
                { name: 'Leaf elder', image: 'leaf-elder' },
            ],
        },
        {
            groupName: 'Windmill',
            locations: [
                { name: 'Awaken the windmill guard', image: 'windmill-guard-sleeping' },
                { name: 'Unseal windmill cave', image: 'windmill-sealed-cave-open' },
            ],
        },

        {
            groupName: 'Windmill Cave',
            locations: [
                { name: 'Windmill cave #1' },
                { name: 'Windmill cave #2' },
                { name: 'Windmill cave #3' },
                { name: 'Windmill cave #4' },
                { name: 'Windmill cave #5' },
                { name: 'Vampire drop', image: 'vampire' },
            ],
        },

        {
            groupName: 'Brynmaer',
            locations: [
                { name: 'Akahana trade-in', image: 'akahana' },
            ],
        },

        {
            groupName: 'Cordel Plain',
            locations: [
                { name: 'Cordel plain shrubbery', image: 'cordel-onyx-shrubbery' },
                { name: 'Defeat Stom', image: 'stom-sword' },
            ],
        },

        {
            groupName: 'Oak',
            locations: [
                { name: 'Rescue dwarf child', image: 'dwarf-child' },
                { name: 'Oak elder', image: 'dwarf-elder' },
                { name: 'Giant Insect drop', image: 'giant-insect' },
            ],
        },

        {
            groupName: 'Mt. Sabre South',
            locations: [
                { name: 'Mt. Sabre South item #1' },
                { name: 'Mt. Sabre South item #2' },
                { name: 'Mt. Sabre South item #3' },
                { name: 'Mt. Sabre South item #4' },
                { name: 'Mt. Sabre South Tornel', image: 'tornel' },
            ],
        },

        {
            groupName: 'Mt. Sabre North',
            locations: [
                { name: 'Mt. Sabre North item #1' },
                { name: 'Mt. Sabre North item #2' },
                { name: 'Mt. Sabre North item #3' },
                { name: 'Kelbesque drop', image: 'kelbesque' },
                { name: 'Open prison door', image: 'leaf-elder' },
            ],
        },

        {
            groupName: 'Portoa',
            locations: [
                { name: 'Portoa Queen item', image: 'portoa-queen' },
                { name: 'Heal dolphin', image: 'dolphin-sick' },
                { name: 'Asina behind throne room', image: 'asina' },
            ],
        },

        {
            groupName: 'Waterfall Cave',
            locations: [
                {name: 'Waterfall cave item #1'},
                {name: 'Un-petrify Akahana', image: 'akahana-petrified'},
                {name: 'Waterfall cave item #2'},
                {name: 'Waterfall cave item #3'},
            ],
        },

        {
            groupName: 'Lime Tree',
            locations: [
                { name: 'Lime tree item', image: 'rage' },
            ],
        },

        {
            groupName: 'Fog Lamp Cave',
            locations: [
                { name: 'Fog Lamp Cave item #1' },
                { name: 'Fog Lamp Cave item #2' },
                { name: 'Fog Lamp Cave item #3' },
                { name: 'Fog Lamp Cave item #4' },
            ],
        },

        {
            groupName: 'Kirisa Plant Cave',
            locations: [
                { name: 'Kirisa plant Cave Item #1' },
                { name: 'Kirisa plant shrubbery', image: 'kirisa-plant-shrubbery' },
            ],
        },

        {
            groupName: 'Amazones',
            locations: [
                { name: 'Amazones basement' },
                { name: 'Kirisa plant trade-in', image: 'aryllis' },
            ],
        },

        {
            groupName: 'Joel',
            locations: [
                { name: 'Wake up Kensu', image: 'kensu-sleeping' },
            ],
        },

        {
            groupName: 'Angry Sea',
            locations: [
                { name: 'Underground channel item', image: 'love-pendant-location' },
                { name: 'Calm whirlpool', image: 'whirlpool' },
            ],
        },

        {
            groupName: 'Evil Spirit Island',
            locations: [
                { name: 'Evil Spirit Island item #1' },
                { name: 'Evil Spirit Island item #2' },
                { name: 'Evil Spirit Island item #3' },
                { name: 'Evil Spirit Island item #4' },
                { name: 'Clark item after defeating Sabera', image: 'clark' },
            ],
        },

        {
            groupName: 'Sabera\'s Castle',
            locations: [
                { name: 'Sabera\'s Castle item #1' },
                { name: 'Vampire 2 drop', image: 'vampire' },
                { name: 'Sabera\'s Castle item #2' },
                { name: 'Sabera drop', image: 'sabera' },
            ],
        },

        {
            groupName: 'Swan',
            locations: [
                { name: 'Return Love Pendant', image: 'kensu' },
            ],
        },

        {
            groupName: 'Goa',
            locations: [
                { name: 'Item from Akahana\'s friend', image: 'akahana-friend' },
            ],
        },

        {
            groupName: 'Shyron',
            locations: [
                { name: 'Item from Zebu', image: 'zebu' },
                { name: 'Mado 1 drop', image: 'mado' },
            ],
        },

        {
            groupName: 'Mt. Hydra',
            locations: [
                { name: 'Mt. Hydra item #1' },
                { name: 'Mt. Hydra item #2' },
                { name: 'Mt. Hydra item #3' },
                { name: 'Mt. Hydra item #4' },
                { name: 'Mt. Hydra item #5' },
            ],
        },

        {
            groupName: 'Styx',
            locations: [
                { name: 'Styx item #1' },
                { name: 'Styx item #2' },
                { name: 'Styx item #3' },
                { name: 'Styx item #4' },
                { name: 'Styx item #5' },
                { name: 'Styx item #6' },
            ],
        },

        {
            groupName: 'Draygonia Castle 1',
            locations: [
                { name: 'Kelbesque 2 drop', image: 'kelbesque' },
            ],
        },

        {
            groupName: 'Draygonia Castle 2',
            locations: [
                { name: 'Sabera 2 item #1' },
                { name: 'Sabera 2 item #2' },
                { name: 'Sabera 2 item #3' },
                { name: 'Sabera 2 drop', image: 'sabera' },
            ],
        },

        {
            groupName: 'Draygonia Castle 3',
            locations: [
                { name: 'Mado 2 item #1' },
                { name: 'Mado 2 item #2' },
                { name: 'Mado 2 item #3' },
                { name: 'Mado 2 item #4' },
                { name: 'Mado 2 item #5' },
                { name: 'Mado 2 drop', image: 'mado2' },
            ],
        },

        {
            groupName: 'Draygonia Castle 4',
            locations: [
                { name: 'Karmine item #1' },
                { name: 'Karmine item #2' },
                { name: 'Karmine item #3' },
                { name: 'Karmine item #4' },
                { name: 'Karmine item #5' },
                { name: 'Karmine', image: 'karmine' },
                { name: 'Karmine item #6' },
                { name: 'Cure Kensu', image: 'slime-blue' },
            ],
        },

        {
            groupName: 'Oasis Cave',
            locations: [
                { name: 'Oasis cave item #1' },
                { name: 'Oasis cave item #2' },
                { name: 'Oasis cave item #3' },
                { name: 'Oasis cave item #4' },
                { name: 'Oasis cave item #5' },
            ],
        },

        {
            groupName: 'Desert meadow',
            locations: [
                { name: 'Item from Deo', image: 'deo-walking' },
            ],
        },

        {
            groupName: 'Pyramid',
            locations: [
                { name: 'Pyramid item #1' },
                { name: 'Emperor drop', image: 'emperor' },
                { name: 'Azteca item', image: 'azteca' },
            ],
        },

        {
            groupName: 'Pyramid basement',
            locations: [
                { name: 'Pyramid basement item #1' },
                { name: 'Pyramid basement item #2' },
            ],
        },
    ];

    const discoverItem = (itemName, locationName) => {
        const item = items.find(item => item.name === itemName);

        const locationEl = document.querySelector(`.location[data-name="${locationName}"]`);
        if (locationEl) {
            const index = item.locations.indexOf(locationName);
            if (index === -1) {
                item.locations.push(locationName);
            }
            locationEl.classList.add('discovered');
            locationEl.classList.remove('undiscovered');
            const discoveredItem = locationEl.querySelector('.discovered-item');
            const img = document.createElement('img');
            img.src = item.imageSrc;
            img.setAttribute('alt', item.name);

            discoveredItem.appendChild(img);
            img.addEventListener('click', () => {
                undiscoverItem(item.name, locationName);
            });
        }

        if (item.locations.length >= item.max) {
            item.el.classList.add('consumed');
        } else {
            item.el.classList.remove('consumed');
        }

        updateCounter(item);

        save();
    };

    const updateCounter = (item) => {
        const counter = item.el.querySelector('.item-counter');
        if (counter) {
            counter.innerText = item.max - item.locations.length;
        }
    };

    const undiscoverItem = (itemName, locationName) => {
        const item = items.find(item => item.name === itemName);
        const locations = locationName ? [ locationName ] : item.locations.concat([]);

        locations.forEach((locationName) => {
            if (locations.length) {
                const index = item.locations.indexOf(locationName);
                if (index !== -1) {
                    item.locations.splice(index, 1);
                }
            }

            if (item.locations.length >= item.max) {
                item.el.classList.add('consumed');
            } else {
                item.el.classList.remove('consumed');
            }

            const locationEl = document.querySelector(`.location[data-name="${locationName}"]`);
            locationEl.classList.remove('discovered');
            locationEl.classList.add('undiscovered');
            const img = locationEl.querySelector('.discovered-item img');
            if (img) {
                img.parentNode.removeChild(img);
            }

            updateCounter(item);
        });

        save();
    };

    const itemListsContainer = document.querySelector('.item-lists-container');
    let dragGhost = null;

    const createItemList = (items) => {
        const list = document.createElement('ul');
        list.className = `item-list`;

        items.forEach((item) => {
            const li = document.createElement('li');

            const img = document.createElement('img');
            img.src = item.imageSrc;
            img.setAttribute('alt', item.name);

            const figcaption = document.createElement('figcaption');
            figcaption.className = 'crystalis-message';
            figcaption.appendChild(document.createTextNode(item.name));

            const counter = document.createElement('div');
            counter.className = 'item-counter';
            counter.appendChild(document.createTextNode(item.max));

            const figure = document.createElement('figure');
            item.el = figure;
            figure.classList.add('item');
            figure.appendChild(img);

            if (item.max > 1) {
                figure.appendChild(counter);
            }
            figure.appendChild(figcaption);
            li.appendChild(figure);

            figure.addEventListener('mousedown', (e) => {
                if (e.button !== 0) {
                    return;
                }

                e.preventDefault();

                if (item.locations.length >= item.max) {
                    return;
                }

                document.body.classList.add('dragging');

                dragGhost = {
                    el: figure.cloneNode(true),
                    item,
                };
                dragGhost.el.classList.add('drag-ghost');
                dragGhost.el.style.left = (e.clientX + document.documentElement.scrollLeft) + 'px';
                dragGhost.el.style.top = (e.clientY + document.documentElement.scrollTop) + 'px';
                document.body.appendChild(dragGhost.el);
            });

            list.appendChild(li);
        });

        itemListsContainer.appendChild(list);
    };

    const createDivider = () => {
        itemListsContainer.appendChild(document.createElement('hr'));
    }

    createItemList(items.filter(item => item.group === 'armor'));
    createDivider();
    createItemList(items.filter(item => item.group === 'sword-wind'));
    createItemList(items.filter(item => item.group === 'sword-fire'));
    createItemList(items.filter(item => item.group === 'sword-water'));
    createItemList(items.filter(item => item.group === 'sword-thunder'));
    createDivider();
    createItemList(items.filter(item => item.group === 'consumables'));
    createDivider();
    createItemList(items.filter(item => item.group === 'wearables'));
    createDivider();
    createItemList(items.filter(item => item.group === 'magic'));
    createDivider();
    for (let i = 0; i <= 5; i++) {
        createItemList(items.filter(item => item.group === `event-${i}`));
    }
    createDivider();
    createItemList(items.filter(item => item.group === 'other'));

    const locationContainer = document.querySelector('.locations-container');
    itemLocations.forEach((group) => {
        const name = group.groupName;
        const locations = group.locations;

        const container = document.createElement('div');
        container.className = 'location-area';

        const header = document.createElement('header');
        header.appendChild(document.createTextNode(name));
        container.appendChild(header);

        const list = document.createElement('ul');
        locations.forEach((data) => {
            if (typeof(data) !== 'object') {
                return;
            }
            const li = document.createElement('li');
            li.className = 'location undiscovered';
            const imgContainer = document.createElement('div');
            imgContainer.className = 'location-img-container';
            li.appendChild(imgContainer);
            const img = document.createElement('img');
            img.className = 'location-icon';
            img.src = data.image ?
                `images/locations/${data.image}-square.png` :
                'images/locations/treasure-chest-square.png';
            img.setAttribute('alt', data.name);

            imgContainer.appendChild(img);

            const usedItem = document.createElement('div');
            usedItem.className = 'discovered-item';
            li.appendChild(usedItem);

            li.setAttribute('title', data.name);
            li.setAttribute('data-name', data.name);

            list.appendChild(li);
        });

        container.appendChild(list);

        locationContainer.appendChild(container);
    });

    document.body.addEventListener('mouseup', (e) => {
        if (!dragGhost) {
            return;
        }

        e.preventDefault();
        const temp = dragGhost;
        dragGhost.el.parentNode.removeChild(dragGhost.el);
        dragGhost = null;
        document.body.classList.remove('dragging');

        const dropTarget = document.querySelector('.drop-target');

        document.querySelectorAll('.location').forEach((location) => {
            location.classList.remove('drop-target');
        });

        if (!dropTarget) {
            return;
        }

        const locationName = dropTarget.getAttribute('data-name');
        discoverItem(temp.item.name, locationName);
    });

    document.body.addEventListener('mousemove', (e) => {
        if (!dragGhost) {
            return;
        }

        document.querySelectorAll('.location').forEach((location) => {
            location.classList.remove('drop-target');
        });

        dragGhost.el.style.left = (e.clientX + document.documentElement.scrollLeft) + 'px';
        dragGhost.el.style.top = (e.clientY + document.documentElement.scrollTop) + 'px';

        const x = e.clientX;
        const y = e.clientY;
        const elements = document.elementsFromPoint(x, y);
        const location = elements.find(el => el.classList.contains('location') &&
            el.classList.contains('undiscovered'));
        if (!location) {
            return;
        }

        location.classList.add('drop-target');
    });

    document.querySelector('.clear-all-btn').addEventListener('click', () => {
        items.forEach((item) => undiscoverItem(item.name));
    });

    load();
})(window);
