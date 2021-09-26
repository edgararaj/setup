function router(pathname) {
	const routes = [
		{ path: "/", html: `<div id="main">
	<h1>What do you want it for?</h1>
	<div class="choices">
		<div class="gaming-pc">
			<div class="text">
				<h2>Gaming</h2>
				<p>Game on max settings,<br>with buttery smooth performace.</p>
			</div>
			<img src="/static/assets/gaming_pc.png"></img>
		</div>
		<div class="work-pc">
			<div class="text">
				<h2>Work</h2>
				<p>Slick and simple design,<br>perfect for office work.</p>
			</div>
			<img src="/static/assets/work_pc.png"></img>
		</div>
	</div>
</div>` },
		{ path: "/computadores", html: `<section id="sobre-nos">
	<div>
		<img src="/static/assets/edgar.jpg"></img>
		<div class="text">
			<h2>Olá,</h2>
			<p>
				Chamo-me Edgar, e estou esfomeado!<br>Começei este projeto em conjunto com o Tomás como uma forma de alcançar a independência, tanto mental como monetaria,
				<br>até agora tem sido incrivel, pois aprendi bastante e tive a oportunidade de juntar o meu grandioso conhecimento a este trabalho.
				<br>Espero que tenham a ter uma boa semana, pois a minha esta uma merda, acabei de obter um corte de chouriço.
			</p>
		</div>
	</div>
	<div>
		<div class="text">
			<h2>Olá,</h2>
			<p>
				Chamo-me Tomás, e não sei nada sobre mim!
			</p>
		</div>
		<img src="/static/assets/tomas.jpg"></img>
	</div>
</section>` },
	];
	pathname = (!pathname || pathname.type == "popstate") ? location.pathname : pathname;
	let route_matched = routes.find(route => route.path == pathname);
	if (pathname != location.pathname) history.pushState(0, 0, route_matched.path);
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
		router(target.pathname);
	}
});

router();
