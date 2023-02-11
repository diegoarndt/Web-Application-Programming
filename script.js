class Model {
  constructor() {
    this.baseEndpoint = 'https://hargrimm-wikihow-v1.p.rapidapi.com';
    this.imgsWithSteps = {};
  }

  async loadImages(count) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':
            '49be42eb34mshd0169a983a56e5bp1c5104jsn6d08f6411767',
          'X-RapidAPI-Host': 'hargrimm-wikihow-v1.p.rapidapi.com',
        },
      };

      const fetchData = async () => {
        try {
          const [images, steps] = await Promise.all([
            fetch(`${this.baseEndpoint}/images?count=${count}`, options).then(
              (r) => r.json()
            ),
            fetch(`${this.baseEndpoint}/steps?count=${count}`, options).then(
              (r) => r.json()
            ),
          ]);
          this.imgsWithSteps = Object.values(images).map((image, i) => {
            return {
              image,
              step: Object.values(steps)[i],
            };
          });
          resolve(this.imgsWithSteps);
        } catch (err) {
          return Promise.reject(err);
        }
      };

      fetchData();
    });
  }
}

class View {
  constructor() {
    this.selectedImageCount = document.querySelector('#image-count');
    this.showMeImagesButton = document.querySelector('#btn-load');
    this.imgContainer = document.querySelector('#images-container');
    this.errorContainer = document.querySelector('#error-container');
  }

  updateImages(imgsWithSteps) {
    if (imgsWithSteps.length === 0) {
      this.showError('Sorry, unfortunately no images have been found');
      return;
    }

    this.clearContainers();

    imgsWithSteps.forEach((imageObject) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.classList.add('m-3');

      const img = document.createElement('img');
      img.src = imageObject.image;
      img.classList.add('card-img-top');
      card.appendChild(img);

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const cardText = document.createElement('p');
      cardText.classList.add('card-text');
      cardText.textContent = imageObject.step;
      cardBody.appendChild(cardText);

      card.appendChild(cardBody);
      this.imgContainer.appendChild(card);
    });
  }

  showError(error) {
    this.imgContainer.innerHTML = '';
    this.errorContainer.parentElement.classList.add('alert-warning');
    this.errorContainer.innerHTML = error;
  }

  clearContainers() {
    this.imgContainer.innerHTML = '';
    this.errorContainer.innerHTML = '';
    this.errorContainer.parentElement.classList.remove('alert-warning');
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.showMeImagesButton.addEventListener('click', async () => {
      await this.model.loadImages(this.view.selectedImageCount.value);
      const { imgsWithSteps } = this.model;
      this.view.updateImages(imgsWithSteps);
    });
  }
}

const app = new Controller(new Model(), new View());
