
//le personnage
/**
 * Crée une table de nbLigexnbColonne avec un taux de mur de pmur
 * @param {integer} nbLigne nombre de ligne
 * @param {integer} nbColonne ,ombre de colonne
 * @param {integer} pmur pourcentage de mur dans le tableau
 */
function creerDamier(nbLigne, nbColonne, pmur) {
    let t = document.createElement("table");
    t.style.border = "1px solid #444";
    document.body.appendChild(t);
    for (let i = 0; i < nbLigne; i++) {
        let l = document.createElement("tr");
        t.appendChild(l);
        for (let j = 0; j < nbColonne; j++) {
            let c = document.createElement("td");
            c.style.border = "1px solid #777";
            c.style.width = "40px";
            c.style.height = "40px";
            if (100 * Math.random() < pmur)
                c.dataset.type = "mur";
            else
                c.dataset.type = "vide";

            //c.tabindex=1;
            if ((i + j) % 2 == 0) {
                c.style.backgroundColor = "#FEF";
            } else {
                c.style.backgroundColor = "#EFE";
            }

            if (c.dataset.type == "mur") {
                c.style.backgroundColor = "#000";
            }

            l.appendChild(c);
        }
    }

    t.rows[nbLigne-1].cells[nbColonne-1].dataset.type="sortie";
    t.rows[nbLigne-1].cells[nbColonne-1].style.backgroundColor="#900";
    return t;
}

function distance(x, y, a, b) {
    return Math.abs(x - a) + Math.abs(y - b);
}


function clavier(e) {
    let x = perso.dom.dataset.x;
    let y = perso.dom.dataset.y;

    if (e.key == "ArrowRight") {
        if (perso.dom.dataset.x < damier.rows[0].cells.length - 1) {
            x++;
        }
    } else if (e.key == "ArrowLeft") {
        if (perso.dom.dataset.x > 0) {
            x--;
        }
    } else if (e.key == "ArrowUp") {
        if (perso.dom.dataset.y > 0) {
            y--;
        }
    } else if (e.key == "ArrowDown") {
        if (perso.dom.dataset.y < damier.rows.length - 1) {
            y++;
        }
    }

    if (damier.rows[y].cells[x].dataset.type == "mur") {
        sonpas.src = "mur.mp3";
        sonpas.play();
        etat.innerHTML = "x=" + perso.dom.dataset.x + " y=" + perso.dom.dataset.y + " vous avez cogné un mur";
        etat.focus();
        return;
    } else {
        perso.deplacer(x, y);        
        sonpas.src = "pas.mp3";
        sonpas.play();
        if (damier.rows[y].cells[x].dataset.type == "sortie") {
            document.body.removeEventListener("keydown", clavier);
            damier.innerHTML = "";
            perso.dom.style.width = "500px";
            perso.dom.style.height = "500px";
            document.body.appendChild(perso.dom);
            etat.innerHTML = "Vous avez gagné";
        }

        for (let i = 0; i < meute.length; i++) {
            let tab = calculDeplacementLoup(parseInt(x), parseInt(y), parseInt(meute[i].dom.dataset.x), parseInt(meute[i].dom.dataset.y));
            let a = tab[0];
            let b = tab[1];
            //ne rentre pas dans les murs
            if (damier.rows[b].cells[a].dataset.type != "mur") {
                meute[i].deplacer(a, b);   
                let d=distance(x, y, a, b);
                sonloup.src="loup.mp3";
                sonloup.volume=1-d/distanceMax;  
                sonloup.play();
                if (a == x && b == y) {
                    document.body.removeEventListener("keydown", clavier);
                    perso.dom.parentElement.removeChild(perso.dom);
                    damier.innerHTML = "";
                    meute[i].dom.style.width = "500px";
                    meute[i].dom.style.height = "500px";
                    document.body.appendChild(meute[i].dom);
                    etat.innerHTML = "<br>Le loup mange le perso";
                }
            }
        }
    }
}

function calculDeplacementLoup(x, y, a, b) {
    let dx = Math.abs(x - a);
    let dy = Math.abs(y - b);
    if (dx >= dy) {
        if (a > x) {
            a--;
        } else if (a < x) {
            a++;
        }
    } else {
        if (b > y) {
            b--;
        } else if (b < y) {
            b++;
        }
    }
    return [a, b];
}

class Perso {
    /**
     * Création d'un objet (this) de type Perso
     * @param {fichier image} image 
     * @param {integer} x 
     * @param {integer} y 
     * @param {fichier son} son 
     * @param {string} alt
     */
    constructor(image,x,y,son,alt) {
        this.dom=document.createElement("img");
        this.dom.src=image;
        this.dom.dataset.x=x;
        this.dom.dataset.y=y;
        this.son=son;
        this.dom.style.width = "40px";
        this.dom.style.height = "40px";
        this.dom.alt = alt;
    }

    deplacer(x,y) {
        this.dom.dataset.y = y;
        this.dom.dataset.x = x;
        damier.rows[y].cells[x].appendChild(this.dom);
    }
}

//Initialisation
const nbColonne=10;
const nbLigne=10;
const distanceMax=nbColonne+nbLigne;

document.body.addEventListener("keydown", clavier);
let damier = creerDamier(nbLigne, nbColonne, 10);
let perso = new Perso("perso.png",0,0,"pas.mp3","Gilles");
perso.deplacer(0,0);
let meute = [];
for (let i = 0; i < 5; i++) {
    meute.push(new Perso("loup.png",i, nbLigne-1, "loup.mp3", "loup " + i));
    meute[i].deplacer(i, nbLigne-1);
}

let etat = document.getElementById("etat");
let sonpas = document.createElement("audio");
let sonloup = document.createElement("audio");

//initialise le personnage dans le damier
damier.rows[0].cells[0].dataset.type = "vide";



