const valition = () => {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const submit = document.getElementById('submit');

    if (!name || name.trim().length == 0 || !price || price.trim().length == 0 || Number(price) < 0|| !quantity || quantity.trim().length == 0 || Number(quantity)<0) {
        submit.disabled = true;
    } else {
        submit.disabled = false;
    }
}

const onChangeFile = () => {
    const file = document.getElementById('image-file').files[0];
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('image-view').src = e.target.result;
      document.getElementById('image-view').style.display = 'block';
    }
    reader.readAsDataURL(file);
}