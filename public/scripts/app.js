const starRating = document.querySelector(".starRating");
const stars = document.querySelectorAll(".star");
const form = document.querySelector("#reviewForm");

stars.forEach(s => {
    s.addEventListener("mouseenter", e => {
        const n = e.target.id;
        fillStars(n, false);
    });
    s.addEventListener("mouseleave", e => {
        stars.forEach(s => s.classList.remove("checked"));
    });
    s.addEventListener("click", e => {
        stars.forEach(s => s.classList.remove("fixed"));
        const n = e.target.id;
        fillStars(n, true);
    })
});

form.addEventListener("submit", async() => {
    if (!document.querySelector(".fixed")) {
        starsError()
            .then(() => starsError())
            .then(() => starsError())
    }
});

const fillStars = (n, fixed) => {
    for (i = 0; i < n; i++) {
        stars[i].classList.add("checked");
        if (fixed) { stars[i].classList.add("fixed"); }
    }
}

const starsError = () => {
    return new Promise((resolve, reject) => {
        starRating.classList.add("shifted");
        setTimeout(() => {
            starRating.classList.remove("shifted");
        }, 100);
        setTimeout(() => resolve(), 200);
    });
};