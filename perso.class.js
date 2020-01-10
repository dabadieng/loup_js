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
        this=document.createElement("img");
        this.src=image;
        this.dataset.x=x;
        this.dataset.y=y;
        this.dataset.son=son;
        this.style.width = "40px";
        this.style.height = "40px";
        this.alt = alt;
    }

    deplacer(x,y) {
        this.dataset.y = y;
        this.dataset.x = x;
        damier.rows[y].cells[x].appendChild(this);
    }
}