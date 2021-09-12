function router() {
	const routes = [
		{ path: "/", html: `#include "main.html"` },
		{ path: "/sobre-nos", html: `#include "sobre_nos.html"` },
	];
	let route_matched = routes.find(route => route.path == location.pathname);
	if (!route_matched) {
		route_matched = routes[0];
		history.replaceState(0, 0, route_matched.path);
	}

	const content = document.getElementById("content");
	content.innerHTML = route_matched.html;
}

addEventListener("popstate", router);

document.body.addEventListener("click", e => {
	let target = e.target;
	if (target.tagName != "A" && target.parentNode.tagName == "A")
		target = target.parentNode;

	if (target.matches("[route]")) {
		e.preventDefault();
		history.pushState(0, 0, target.href);
		router();
	}
});

router();
