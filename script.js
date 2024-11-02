// Always vanilla JS, no libraries or frameworks
var npc_data = {};
// Stores NPC names all lowercase, points to NPC or array of NPCs
var npc_names = {};

function onload() {
    // load NPC data from data/npc_data.json
    fetch('data/npc_data.json')
        .then(response => response.json())
        .then(data => {
            npc_data = data;
            // Process NPC data into a searchable list
            for (let id in npc_data) {
                let npc = npc_data[id];
                let name = (npc.name || "??").toLowerCase();
                if (!npc_names[name]) {
                    npc_names[name] = id;
                } else {
                    if (!Array.isArray(npc_names[name])) {
                        npc_names[name] = [npc_names[name]];
                    }
                    npc_names[name].push(id);
                }
            }
        });
}

function get_style(n) {
    if (!n) {
        return "Melee";
    } else if (n == "1") {
        return "Ranged";
    } else if (n == "2") {
        return "Magic";
    } else {
        return "Unknown ("+n+")";
    }
}

function get_clue(n) {
    if (n == "0") {
        return "Easy";
    } else if (n == "1") {
        return "Medium";
    } else if (n == "2") {
        return "Hard";
    }
        return "None";
}

function search_npcs(input) {
    let query = input.toLowerCase();
    let results = [];
    for (let name in npc_names) {
        if (name.includes(query)) {
            results.push(name);
        }
    }
    if (results.length > 0) {
        let list = document.getElementById('npc-dropdown');
        list.innerHTML = '';
        // Create dropdown options, each name should be paired with their ID (ex: 'Goblin (12)'), the ID should be used to load the NPC
        results.forEach(name => {
            let ids = npc_names[name];
            if (!Array.isArray(ids)) {
                ids = [ids];
            }
            ids.forEach(id => {
                let option = document.createElement('option');
                option.value = id;
                option.innerText = `${npc_data[id].name} (${id})`;
                option.onclick = () => load_npc(id);
                list.appendChild(option);
            });
        });
        // Show dropdown if it contains more than 1 result
        document.getElementById('npc-dropdown-box').hidden = results.length <= 1;
        load_npc(list.value);
        return true;
    }
    document.getElementById('npc-dropdown-box').hidden = true;
    return false;
}

function search_npc() {
    let npc = document.getElementById('npc-search').value;
    if (!npc_data[npc]) {
        if (!search_npcs(npc)) {
            document.getElementById('npc-box').hidden = true;
            return;
        }
    }
    document.getElementById('npc-box').hidden = false;
    load_npc(npc);
}

function select_npc(dropdown) {
    let id = dropdown.value;
    load_npc(id);
}

function load_npc(id) {
    let npc = npc_data[id];
    if (!npc) return;

    document.getElementById('npc-name').innerText = npc.name;
    document.getElementById('npc-id').innerText = id;
    document.getElementById('npc-combat').innerText = npc.combat_level;
    document.getElementById('npc-examine').innerText = npc.examine;
    document.getElementById('npc-clue').innerText = get_clue(npc.clue);
    document.getElementById('npc-attack_style').innerText = get_style(npc.attack_style);

    if (npc.attack_speed) {
        document.getElementById('npc-attack_speed').innerText = Math.round((npc.attack_speed*0.6 + Number.EPSILON)*100)/100 + ' seconds';
    } else {
        document.getElementById('npc-attack_speed').innerText = '3.6 seconds';
    }
    if (npc.respawn_time) {
        document.getElementById('npc-respawn').innerText = Math.round((npc.respawn_time*0.6 + Number.EPSILON)*100) + ' seconds';
    } else {
        document.getElementById('npc-respawn').innerText = '15 seconds';
    }

    // Yes or No
    document.getElementById('npc-aggressive').innerText = npc.aggressive ? 'Yes' : 'No';

    if (npc.poisonous) {
        document.getElementById('npc-poisonous').innerText = 'Yes (' + npc.poison_amount + ')';
    } else {
        document.getElementById('npc-poisonous').innerText = 'No';
    }

    document.getElementById('npc-hitpoints').innerText = npc.lifepoints || '?';
    document.getElementById('npc-att').innerText = npc.attack_level || '?';
    document.getElementById('npc-str').innerText = npc.strength_level || '?';
    document.getElementById('npc-def').innerText = npc.defence_level || '?';
    document.getElementById('npc-mage').innerText = npc.magic_level || '?';
    document.getElementById('npc-range').innerText = npc.ranged_level || '?';
    document.getElementById('npc-weakness').innerText = npc.weakness || '?';

    let bonuses = [];
    if (npc.bonuses) {
        bonuses = npc.bonuses.split(',');
        // "bonuses": "18,18,18,0,0,73,76,70,-11,72,0,16,0,0,0"
        // attbns, ??, ??, amagic, arange, dstab, dslash, dcrush, dmagic, drange, ??, strbns, ??, ??, rngbns
        // first 3 are probably different att styles...
        bonuses = bonuses.map(bonus => {
            if (!bonus) return '?';
            let value = parseInt(bonus, 10);
            return value >= 0 ? `+${value}` : `${value}`;
        });
        document.getElementById('npc-attbns').innerText = bonuses[0];
        document.getElementById('npc-amagic').innerText = bonuses[3];
        document.getElementById('npc-arange').innerText = bonuses[4];
        document.getElementById('npc-dstab').innerText = bonuses[5];
        document.getElementById('npc-dslash').innerText = bonuses[6];
        document.getElementById('npc-dcrush').innerText = bonuses[7];
        document.getElementById('npc-dmagic').innerText = bonuses[8];
        document.getElementById('npc-dranged').innerText = bonuses[9];
        document.getElementById('npc-strbns').innerText = bonuses[10];
    }

}