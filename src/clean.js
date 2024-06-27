import localizedDOM from "./helpers/Contact Us - French.json" assert { type: "json" }; // Localized "Contact Us DOM

function run() {
    localizedDOM.nodes.forEach( node => {
        delete node.type
        delete node.attributes        
        if (node.text) node.text = node.text.html
        if (node.image) node.image = node.image.assetId
        
})

console.log(JSON.stringify(localizedDOM))

}

run()