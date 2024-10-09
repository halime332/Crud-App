//! Gerekli HTML elementlerii seç
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn=document.querySelector(".clear-btn");


// Düzenleme seçenekleri
let editElement;
let editFlag = false; //Düzenleme modunda olup olmadığını belirtirler
let editID = ""; // Düzenleme yapılan ögenin benzersiz kimliği

//! Fonksiyonlar
const setBackToDefault = () =>{
  grocery.value = ""
  editFlag= false
  editID =""
  submitBtn.textContent ="ekle";
}

const displayAlert = (text, action) => {
  
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(()=>{
    alert.textContent = ""
    alert.classList.remove(`alert-${action}`);
  },2000);
};
// tıkladığımız "article" ekrandan kaldıracak fpnksiyondur
const deleteItem =(e) =>{
  const element= e.currentTarget.parentElement.parentElement;// "article" etiketine eriştik
  const id= element.dataset.id;
  list.remove(element); // list etikti içerisinden "article" etiketini kaldırdı
  displayAlert("öge kaldırıldı","danger");
  setBackToDefault();
  removeFromLocalStorage(id);

}
const editItem = (e) =>{
  const element = e.currentTarget.parentElement.parentElement;// "article " etiketine parentelemnt sayesinde ulaştık
  editElement = e.currentTarget.parentElement.previousElementSibling; // butonun kapsayıcısına eriştikten sonra butonun kardeş etiketine ulaştık
  console.log(editElement.innerText);
  //tıkladığım "article" etiketi içerisindeki p etiketinin textini inputun içerisine gönderme
  grocery.value =editElement.innerText;

  editFlag= true;
  editID = element.dataset.id ; //düzenlenen  ögenin kimliğine erişme
  submitBtn.textContent ="Düzenle";  // düxenleme işleminde submitin içerik kısmın güncelledi
};
const addItem = (e) => {
  e.preventDefault(); //* Formun otomatik göndermesini engeller.
  const value = grocery.value; //* Form içerisinde bulunan inputun  değerini aldık.
  const id = new Date().getTime().toString(); //* benzersiz bir id oluşturduk
  // Eğer iput boş değilse ve düzenleme modunda değilse çalışacak blok yapısı
  if (value !=="" && !editFlag) {
    const element = document.createElement("article"); // Yeni bir article etiketi oluşturduk
    let attr = document.createAttribute("data-id"); // yeni bir article elementi oluşturduk
    attr.value = id;
    element.setAttributeNode(attr); // oluşturduğumuz id 'yi article et,ketine ekledik
    element.classList.add("grocery-item"); // oluşturduğumuz "article" class ekledik

    element.innerHTML = `
       <p class="title">${value}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
    `;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem); 
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem); 
    // kapsayıcıya oluşturduğumuz "article " etiketini ekledik
    list.appendChild(element);
    displayAlert("başarıyla eklenildi","success");
    container.classList.add("show-container");
    setBackToDefault();
  } else if (value !=="" && editFlag){
    //Değiştiriceğimiz p etiketinin içerik kısmına kullanıcının inputa girdiği değeri gönderdik
    editElement.innerText = value ;
    // Ekrana alert yapısını bastırdık
    displayAlert("değer değiştirildi", "success");
    editlocalStorage(editID,value);
    setBackToDefault();
  }
};

const clearItems = () =>{
  const items =document.querySelectorAll(".grocery-item");
  //listede öge varsa çalışır
  if(items.length>0){
    items.forEach((item) => list.removeChild(item));
  }
  // container yapısını gizle
  container.classList.remove("show-container");
  displayAlert("liste boş","danger");
  setBackToDefault();

};
const createListItem = (id,value) =>{
  const element = document.createElement("article"); // Yeni bir article etiketi oluşturduk
  let attr = document.createAttribute("data-id"); // yeni bir article elementi oluşturduk
  attr.value = id;
  element.setAttributeNode(attr); // oluşturduğumuz id 'yi article et,ketine ekledik
  element.classList.add("grocery-item"); // oluşturduğumuz "article" class ekledik

  element.innerHTML = `
     <p class="title">${value}</p>
      <div class="btn-container">
        <button type="button" class="edit-btn">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="delete-btn">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
  `;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem); 
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem); 
  // kapsayıcıya oluşturduğumuz "article " etiketini ekledik
  list.appendChild(element);

  container.classList.add("show-container");
  setBackToDefault();
};

const setupItems = () => {
  let items =getLocalStorage();
 if(items.length>0){
   items.forEach((item) =>{
    createListItem(item.id,item.value);
  });
 }
};


 //! olay  izleyicisi
 // yerel depoya öğe ekleme işlem,
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click",clearItems);
window.addEventListener("DOMContentLoaded",setupItems);

/* Local storage */
// yerel depoya öge ekleme işlemi
const addToLocalStorage = (id,value) =>{
  const grocery = {id, value};
  let items=getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};
// yerel depodan ögeleri alma işlemi
const getLocalStorage = () =>{
  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [] ;
};
// localstoragedan veriyi silme
const removeFromLocalStorage = (id) => {
  //localStorageda bulunan verileri getir
  let items = getLocalStorage();
  //tıkladığım etiketin idsi ile localStorageda ki id eşit değilse bunu diziden çıkar ve yeni bir elemana aktar
 items = items.filter((item)  => {
    if (item.id !== id) {
      return item ;
    }
  });
  console.log(items);
  localStorage.setItem("list" , JSON.stringify(items));
};
// yerel depoda update işlemi
const editlocalStorage = (id,value) => {
  let items =getLocalStorage();
  //yerel depodaki verilerin id ile güncellenecek olan verinin idsi birbirine eşit ise inputa girilen value değişkenini al
  //localstorageda bulunan verinin valuesine aktar
  items=items.map((item) =>{
    if (item.id ==id) {
      item.value = value ;
    }
    return item;

  });
  localStorage.setItem("list", JSON.stringify(items));
  
};

