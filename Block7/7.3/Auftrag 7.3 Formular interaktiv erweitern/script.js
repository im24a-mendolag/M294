let zips = [];

fetch('./places.json')
    .then((res) => res.json())
    .then((data) => zips = data);

let form = document.forms.register;


async function populateCity() {
    const cityInput = form.city;
    const zipValue = form.plz.value;

    const match = zips.find(place => place.zipcode === zipValue)

    if (match) {
        cityInput.value = match.place;
    } else {
        console.log("No city found for " + zipValue)
    }
}

let plz = document.querySelector(".plz");

plz.addEventListener("blur", () => {
    populateCity();
})