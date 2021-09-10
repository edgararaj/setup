const icon = document.getElementById("burger-icon");
const nav = document.querySelector("header nav");
const nav_links = document.querySelectorAll("header nav li a");

function toggle_nav(link, index) {
	nav.classList.toggle("nav-open");
	icon.classList.toggle("nav-open");

	nav_links.forEach((link, index) => {
		if (link.style.animation) {
			link.style.animation = ``;
		} else {
			link.style.animation = `nav-link-fade 400ms ease forwards ${index / 15}s`;
		}
	});
}

icon.addEventListener("click", toggle_nav);
