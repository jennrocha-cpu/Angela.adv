(function () {
  "use strict";

  // Ano atual no rodapé
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Menu mobile
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");

  function closeMenu() {
    toggle.classList.remove("is-open");
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Sombra no cabeçalho ao rolar
  var header = document.querySelector(".header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Animação de entrada dos elementos
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Máscara de telefone brasileiro
  var tel = document.getElementById("telefone");
  tel.addEventListener("input", function () {
    var d = tel.value.replace(/\D/g, "").slice(0, 11);
    var out = d;
    if (d.length > 10) {
      out = "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    } else if (d.length > 6) {
      out = "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    } else if (d.length > 2) {
      out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    } else if (d.length > 0) {
      out = "(" + d;
    }
    tel.value = out;
  });

  // Formulário de contato (validação e envio por e-mail)
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var EMAIL_DESTINO = "contato@seudominio.com.br"; // troque pelo e-mail real

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.classList.remove("is-error");

    var nome = form.nome;
    var email = form.email;
    var mensagem = form.mensagem;
    var valido = true;

    [nome, email, mensagem].forEach(function (campo) {
      var ok = campo.value.trim() !== "";
      if (campo === email) ok = ok && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value);
      campo.classList.toggle("is-invalid", !ok);
      if (!ok) valido = false;
    });

    if (!valido) {
      status.textContent = "Preencha nome, e-mail válido e mensagem.";
      status.classList.add("is-error");
      return;
    }

    var corpo =
      "Nome: " + nome.value.trim() +
      "\nE-mail: " + email.value.trim() +
      "\nTelefone: " + form.telefone.value.trim() +
      "\n\n" + mensagem.value.trim();

    window.location.href =
      "mailto:" + EMAIL_DESTINO +
      "?subject=" + encodeURIComponent("Contato pelo site - " + nome.value.trim()) +
      "&body=" + encodeURIComponent(corpo);

    status.textContent = "Abrindo seu aplicativo de e-mail para enviar a mensagem...";
    form.reset();
  });
})();
