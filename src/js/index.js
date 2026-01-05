<script src="js/index.js"></script>function resizeHeaderOnScroll() {
  const distanceY = window.pageYOffset || document.documentElement.scrollTop,
  shrinkOn = 200,
  headerEl = document.getElementById('js-header');
  
  if (distanceY > shrinkOn) {
    headerEl.classList.add("smaller");
  } else {
    headerEl.classList.remove("smaller");
  }
}

window.addEventListener('scroll', resizeHeaderOnScroll);


//DROPDOWN
jQuery(document).ready(function(){
    $(".dropdown").hover(
        function() { $('.dropdown-menu', this).stop().fadeIn("fast");
        },
        function() { $('.dropdown-menu', this).stop().fadeOut("fast");
    });
});



//menu
const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menu-button");
const closeButton = document.getElementById("close-button");

function openMenu() {
  sidebar.style.display = "flex";
  sidebar.style.animation = "";
  sidebar.style.animation = "sidebarIn 1s 0s forwards";
}

function closeMenu() {
  sidebar.style.animation = "";
  sidebar.style.animation = "sidebarOut 1s 0s forwards";
  setTimeout(close, 1200);
}

function close() {
  sidebar.style.display = "none";
}

menuButton.addEventListener("click", openMenu);
closeButton.addEventListener("click", closeMenu);