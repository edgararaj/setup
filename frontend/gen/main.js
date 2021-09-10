function router() {
	const routes = [
		{ path: "/", html: `<div id="slideshow">
	<div class="text">
		<a href="#" class="btn style-btn">TIPOS DE ROJÃO</a>
		<h1>Espeto de <br />Rojão</h1>
		<p>O Espeto de Rojão é uma iguaria culinária típica de Ribeirão Grande</p>
		<div class="arrow-icons">
			<button class="disabled-btn">
				<i class="fas fa-arrow-left"></i>
			</button>
			<button class="style-btn">
				<i class="fas fa-arrow-right"></i>
			</button>
		</div>
	</div>
	<img src="/static/imgs/espeto.jpg" class="feature-img" />
</div>` },
		{ path: "/sobre-nos", html: `<section id="sobre-nos">
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
	if (e.target.matches("[route]")) {
		e.preventDefault();
		history.pushState(0, 0, e.target.href);
		router();
	}
});

router();
