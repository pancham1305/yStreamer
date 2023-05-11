const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});
const cards = document.querySelectorAll(".hidden");
cards.forEach((e) => observer.observe(e));


const search = document.querySelector('.input');
search.addEventListener('input', async(e) => {
  const data = fetch("http://localhost:44444/auto",
    {
      method: "POST", 
      
    }
  )
})