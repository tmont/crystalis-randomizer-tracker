((window) => {
    const document = window.document;

    const $ = selector => document.querySelector(selector);
    const $all = selector => document.querySelectorAll(selector);
    const $new = name => document.createElement(name);
    const $text = text => document.createTextNode(text);

    const save = () => {
        const itemData = items.filter(item => item.locations.length > 0).map((item) => {
            return {
                name: item.name,
                locations: item.locations,
            }
        });

        const requirementData = [];
        itemLocations.forEach((group) => {
            if (group.requirement) {
                requirementData.push({
                    locationName: group.groupName,
                    itemName: group.requirement,
                });
            }
            group.locations.forEach((location) => {
                if (location.requirement) {
                    requirementData.push({
                        locationName: location.name,
                        itemName: location.requirement,
                    });
                }
            });
        });

        localStorage.setItem('data', JSON.stringify({ items: itemData, requirements: requirementData }));
    };

    const load = () => {
        const data = localStorage.getItem('data');
        if (!data) {
            return;
        }

        let storageData;
        try {
            storageData = JSON.parse(data);
        } catch (e) {
            console.error('failed to load data from localStorage', e);
            return;
        }

        let items;
        let requirements = [];
        if (Array.isArray(storageData)) {
            // back-compat
            items = storageData;
        } else {
            items = storageData.items;
            requirements = storageData.requirements;
        }

        items.forEach((item) => {
            if (!item || !item.locations) {
                return;
            }

            item.locations.forEach((locationName) => {
                try {
                    discoverItem(item.name, locationName);
                } catch (e) {
                    console.error(`failed to import item ${item.name} to location ${locationName}`);
                }
            });
        });

        requirements.forEach((req) => {
            updateRequirement(req.itemName, req.locationName);
        });
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
            groupName: 'Zebu\'s Cave',
            requirement: null,
            reqType: 'sword',
            locations: [],
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
            requirement: null,
            reqType: 'sword',
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
                { name: 'Akahana trade-in', image: 'akahana', requirement: null, reqType: 'trade-in' },
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
            groupName: 'Mt. Sabre West',
            requirement: null,
            reqType: 'sword',
            locations: [
                { name: 'Mt. Sabre West item #1' },
                { name: 'Mt. Sabre West item #2' },
                { name: 'Mt. Sabre West item #3' },
                { name: 'Mt. Sabre West item #4' },
                { name: 'Tornado bracelet trade-in', image: 'tornel', requirement: null, reqType: 'bracelet' },
            ],
        },

        {
            groupName: 'Mt. Sabre North',
            requirement: null,
            reqType: 'sword',
            locations: [
                { name: 'Mt. Sabre North item #1' },
                { name: 'Mt. Sabre North item #2' },
                { name: 'Mt. Sabre North item #3' },
                { name: 'Kelbesque drop', image: 'kelbesque' },
            ],
        },

        {
            groupName: 'Portoa Sealed Cave',
            requirement: null,
            reqType: 'sword',
            locations: [
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
            requirement: null,
            reqType: 'sword',
            locations: [
                {name: 'Waterfall cave item #1'},
                {name: 'Un-petrify Akahana', image: 'akahana-petrified', requirement: null, reqType: 'trade-in'},
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
            requirement: null,
            reqType: 'sword',
            locations: [
                { name: 'Fog Lamp Cave item #1' },
                { name: 'Fog Lamp Cave item #2' },
                { name: 'Fog Lamp Cave item #3' },
                { name: 'Fog Lamp Cave item #4' },
            ],
        },

        {
            groupName: 'Kirisa Plant Cave',
            requirement: null,
            reqType: 'sword',
            locations: [
                { name: 'Kirisa plant Cave Item #1' },
                { name: 'Kirisa plant shrubbery', image: 'kirisa-plant-shrubbery' },
            ],
        },

        {
            groupName: 'Amazones',
            locations: [
                { name: 'Amazones basement' },
                { name: 'Kirisa plant trade-in', image: 'aryllis', requirement: null, reqType: 'trade-in' },
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
            requirement: null,
            reqType: 'sword',
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
                { name: 'Return Love Pendant', image: 'kensu', requirement: null, reqType: 'trade-in' },
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
            requirement: null,
            reqType: 'sword',
            locations: [
                { name: 'Mt. Hydra item #1' },
                { name: 'Mt. Hydra item #2' },
                { name: 'Mt. Hydra item #3' },
                { name: 'Mt. Hydra item #4' },
                { name: 'Mt. Hydra item #5' },
            ],
        },

        {
            groupName: 'Cave of Styx',
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
            requirement: null,
            reqType: 'sword',
            locations: [
                { name: 'Kelbesque 2 drop', image: 'kelbesque' },
            ],
        },

        {
            groupName: 'Draygonia Castle 2',
            requirement: null,
            reqType: 'sword',
            locations: [
                { name: 'Sabera 2 item #1' },
                { name: 'Sabera 2 item #2' },
                { name: 'Sabera 2 item #3' },
                { name: 'Sabera 2 drop', image: 'sabera' },
            ],
        },

        {
            groupName: 'Draygonia Castle 3',
            requirement: null,
            reqType: 'sword',
            locations: [
                { name: 'Mado 2 item #1' },
                { name: 'Mado 2 item #2' },
                { name: 'Mado 2 item #3' },
                { name: 'Mado 2 item #4' },
                { name: 'Mado 2 item #5' },
                { name: 'Mado 2 drop', image: 'mado2', },
            ],
        },

        {
            groupName: 'Draygonia Castle 4',
            requirement: null,
            reqType: 'sword',
            locations: [
                { name: 'Karmine item #1' },
                { name: 'Karmine item #2' },
                { name: 'Karmine item #3' },
                { name: 'Karmine item #4' },
                { name: 'Karmine item #5' },
                { name: 'Karmine', image: 'karmine' },
                { name: 'Karmine item #6' },
                { name: 'Cure Kensu', image: 'slime-blue', requirement: null, reqType: 'trade-in' },
            ],
        },

        {
            groupName: 'Oasis Cave',
            requirement: null,
            reqType: 'sword',
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

        const locationEl = $(`.location[data-name="${locationName}"]`);
        if (locationEl) {
            const index = item.locations.indexOf(locationName);
            if (index === -1) {
                item.locations.push(locationName);
            }
            locationEl.classList.add('discovered');
            locationEl.classList.remove('undiscovered');
            const discoveredItem = locationEl.querySelector('.discovered-item');
            const img = $new('img');
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

            const locationEl = $(`.location[data-name="${locationName}"]`);
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

    const createRequirement = (itemName, locationName, type) => {
        const req = $new('div');
        req.classList.add('location-requirement');
        req.setAttribute('data-location', locationName);
        req.setAttribute('title', `${locationName} requires ${itemName || '?'}`);
        const img = $new('img');
        const item = itemName ? items.find(item => item.name === itemName) : null;

        const unknownImageSrc = 'images/locations/unknown.png';

        img.setAttribute('alt', itemName);
        img.src = item ? item.imageSrc : unknownImageSrc;

        req.appendChild(img);
        req.addEventListener('click', (e) => {
            e.stopPropagation();

            // show popup for choosing an item
            let itemNames = [];
            if (type === 'sword') {
                itemNames = [
                    'Sword of Wind',
                    'Sword of Fire',
                    'Sword of Water',
                    'Sword of Thunder',
                ];
            } else if (type === 'trade-in') {
                // Kirisa, Flute of Lime
                itemNames = [
                    'Kirisa Plant',
                    'Flute of Lime',
                    'Love Pendant',
                    'Statue of Onyx',
                    'Ivory Statue',
                    'Fog Lamp',
                ];
            } else if (type === 'bracelet') {
                itemNames = [
                    'Tornado Bracelet',
                    'Flame Bracelet',
                    'Blizzard Bracelet',
                    'Storm Bracelet',
                ];
            }

            itemNames.push(null);

            $all('.item-dialog').forEach(el => el.parentNode.removeChild(el));

            const dialog = $new('div');
            dialog.className = 'item-dialog crystalis-message';

            itemNames.forEach((itemName) => {
                const el = $new('div');
                const img = $new('img');
                const item = itemName ?
                    items.find(item => item.name === itemName) :
                    null;
                img.src = item ? item.imageSrc : unknownImageSrc;

                el.appendChild(img);

                el.addEventListener('click', () => {
                    dialog.parentNode.removeChild(dialog);
                    updateRequirement(itemName, locationName, type);
                });

                dialog.appendChild(el);
            });

            const rect = req.getBoundingClientRect();
            const wWidth = window.innerWidth;
            const wHeight = window.innerHeight;

            const estimatedWidth = itemNames.length * 40;
            const estimatedHeight = 40;
            const xStart = rect.left + (rect.width / 2);

            if (xStart + (estimatedWidth / 2) > wWidth) {
                dialog.style.right = '0px';
            } else {
                dialog.style.left = xStart + 'px';
                dialog.style.transform = 'translateX(-50%)';
            }
            if (rect.top + rect.height + estimatedHeight > wHeight) {
                dialog.style.bottom = '0px';
            } else {
                dialog.style.top = (rect.top + rect.height) + 'px';
            }

            document.body.appendChild(dialog);
        });

        return req;
    };

    const updateRequirement = (itemName, locationName) => {
        const req = $(`.location-requirement[data-location="${locationName}"]`);
        if (!req) {
            console.error(`cannot update requirement because location "${locationName}" does not exist`);
            return;
        }

        const item = itemName ? items.find(item => item.name === itemName) : null;

        // update image icon
        req.querySelector('img').src = item ? item.imageSrc : 'images/locations/unknown.png';
        req.setAttribute('title', `${locationName} requires ${itemName || '?'}`);

        // update itemLocations.requirement
        groups: for (const group of itemLocations) {
            if (group.groupName === locationName) {
                group.requirement = itemName || null;
                break;
            }

            for (const location of group.locations) {
                if (location.name === locationName) {
                    location.requirement = itemName || null;
                    break groups;
                }
            }
        }

        save();
    };

    const itemListsContainer = $('.item-lists-container');
    let dragGhost = null;

    const createItemList = (items) => {
        const list = $new('ul');
        list.className = `item-list`;

        items.forEach((item) => {
            const li = $new('li');

            const img = $new('img');
            img.src = item.imageSrc;
            img.setAttribute('alt', item.name);

            const figcaption = $new('figcaption');
            figcaption.className = 'crystalis-message';
            figcaption.appendChild($text(item.name));

            const counter = $new('div');
            counter.className = 'item-counter';
            counter.appendChild($text(item.max));

            const figure = $new('figure');
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
                const ghostCounter = dragGhost.el.querySelector('.item-counter');
                if (ghostCounter) {
                    ghostCounter.parentNode.removeChild(ghostCounter);
                }
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
        itemListsContainer.appendChild($new('hr'));
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

    const locationContainer = $('.locations-container');
    itemLocations.forEach((group) => {
        const name = group.groupName;
        const locations = group.locations;

        const container = $new('div');
        container.className = 'location-area';

        const header = $new('header');
        header.appendChild(document.createTextNode(name));

        if ('requirement' in group) {
            header.appendChild(createRequirement(group.requirement, name, group.reqType));
        }

        container.appendChild(header);

        const list = $new('ul');
        locations.forEach((data) => {
            if (typeof(data) !== 'object') {
                return;
            }

            const li = $new('li');
            li.className = 'location undiscovered';

            const imgContainer = $new('div');
            imgContainer.className = 'location-img-container';


            const img = $new('img');
            img.className = 'location-icon';
            img.src = data.image ?
                `images/locations/${data.image}-square.png` :
                'images/locations/treasure-chest-square.png';
            img.setAttribute('alt', data.name);

            imgContainer.appendChild(img);

            if ('requirement' in data) {
                imgContainer.appendChild(createRequirement(data.requirement, data.name, data.reqType));
            }

            const usedItem = $new('div');
            usedItem.className = 'discovered-item';

            li.appendChild(imgContainer);
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

        const dropTarget = $('.drop-target');

        $all('.location').forEach((location) => {
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

        $all('.location').forEach((location) => {
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

    const isDescendentOf = (el, selector) => {
        while (el && el.matches) {
            if (el.matches(selector)) {
                return true;
            }

            el = el.parentNode;
        }

        return false;
    };

    document.body.addEventListener('click', (e) => {
        const dialogs = $all('.item-dialog');
        if (!dialogs.length) {
            return;
        }

        if (isDescendentOf(e.target, '.item-dialog')) {
            return;
        }

        dialogs.forEach(dialog => dialog.parentNode.removeChild(dialog));
    });

    $('.clear-all-btn').addEventListener('click', () => {
        items.forEach((item) => undiscoverItem(item.name));
        itemLocations.forEach((group) => {
            if ('requirement' in group) {
                updateRequirement(null, group.groupName);
            }
            group.locations.forEach((location) => {
                if ('requirement' in location) {
                    updateRequirement(null, location.name);
                }
            });
        });
    });

    load();
})(window);
