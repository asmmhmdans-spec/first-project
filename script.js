const costElement = document.querySelector(".cost");
let isSavingDecision = false;
let currentPriceInfo = null;
if (costElement) {
  window.addEventListener("scroll", () => {
    const elementTop = costElement.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (elementTop < screenHeight - 100) {
      costElement.classList.add("show");
    }
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show2');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

['.card1', '.card2', '.card3', '.card4', '.card5', '.card6', '.card7'].forEach((className) => {
  const element = document.querySelector(className);
  if (element) observer.observe(element);
});

async function startQuiz() {
  const input = document.getElementById('itemInput');
  const val = input.value.trim();

  if (val === "") {
    input.style.borderBottomColor = "red";
    input.placeholder = "Please enter a product name!";
    return;
  }

  currentPriceInfo = null;

  if (getAuthToken()) {
    try {
      const priceResponse = await apiRequest(`/api/prices?query=${encodeURIComponent(val)}`);
      currentPriceInfo = priceResponse.price;
    } catch {
      currentPriceInfo = { available: false, source: 'Price lookup' };
    }
  }

  nextStep(1);
}

function showResult(resultType) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));

  const resultId = 'result-' + resultType;
  const targetResult = document.getElementById(resultId);

  if (targetResult) {
    targetResult.classList.add('active');
    renderResultPrice(targetResult);
  }
}

function renderResultPrice(targetResult) {
  let preview = targetResult.querySelector('.price-preview');
  if (!preview) {
    preview = document.createElement('p');
    preview.className = 'price-preview';
    preview.style.margin = '12px 0';
    preview.style.fontWeight = '700';
    preview.style.color = '#111';
    const desc = targetResult.querySelector('.desc');
    targetResult.insertBefore(preview, desc ? desc.nextSibling : targetResult.firstChild);
  }

  if (currentPriceInfo && currentPriceInfo.available) {
    preview.textContent = `Real price: ${currentPriceInfo.rawPrice || `${currentPriceInfo.price} ${currentPriceInfo.currency}`} (${currentPriceInfo.source})`;
  } else {
    preview.textContent = 'Real price: not available for this product';
  }
}

function nextStep(stepNum) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('step' + stepNum).classList.add('active');
}

function saveActive(id) {
  localStorage.setItem('activeNavItem', id);
}

window.addEventListener('load', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active2');
  });
});

async function saveProductData(event) {
  if (event) event.preventDefault();

  if (isSavingDecision) return false;
  isSavingDecision = true;
  const clickedButton = event && event.currentTarget ? event.currentTarget : null;
  if (clickedButton) {
    clickedButton.style.pointerEvents = 'none';
    clickedButton.style.opacity = '0.65';
    clickedButton.textContent = 'Saving...';
  }

  if (!getAuthToken()) {
    window.location.href = "form.html";
    return false;
  }

  const itemName = document.getElementById('itemInput').value.trim();
  let resultType = '';

  if (document.getElementById('result-green').classList.contains('active')) {
    resultType = 'green';
  } else if (document.getElementById('result-red').classList.contains('active')) {
    resultType = 'red';
  } else if (document.getElementById('result-orange').classList.contains('active')) {
    resultType = 'orange';
  }

  if (!itemName || !resultType) return false;

  try {
    const priceResponse = currentPriceInfo
      ? { price: currentPriceInfo }
      : await apiRequest(`/api/prices?query=${encodeURIComponent(itemName)}`);

    await apiRequest('/api/decisions', {
      method: 'POST',
      body: JSON.stringify({
        name: itemName,
        status: resultType,
        priceInfo: priceResponse.price
      })
    });
    window.location.href = "dash-board.html";
  } catch (error) {
    alert(error.message);
    isSavingDecision = false;
    if (clickedButton) {
      clickedButton.style.pointerEvents = '';
      clickedButton.style.opacity = '';
      clickedButton.textContent = 'View Your Dashboard';
    }
  }

  return false;
}
