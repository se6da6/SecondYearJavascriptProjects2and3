let table = document.querySelector("table tbody");
let pageNumber = 0;
let take = 5;
let skip;
let count;
let isFilterApplied = false;
let filterList = document.getElementById("filter");

let sortBy, criteria;
let subFilterDropDown = document.getElementById("subFilter");
//Adding values in the second filter according to first filter choice

filterList.addEventListener("change", (event) => {
  
  let selectedFilter = filterList.value;
  let subFilterDropDown = document.getElementById("subFilter");
  subFilterDropDown.innerHTML = "<option value>--No Filter--</option>";
  fetch("./promiseAll")
  .then((response) => response.json())
  .then((data) => {   
    if (selectedFilter === "city") {
      sortBy = "city";
      subFilterDropDown.innerHTML="<option value>--No Filter--</option>";
      for (let i = 0; i < data.city.length; i++) {
        subFilterDropDown.innerHTML += `<option>
          ${data.city[i].city}
        </option>`;
      }
    } else if (selectedFilter === "country") {
      sortBy = "country";
      subFilterDropDown.innerHTML="<option value>--No Filter--</option>";
      for (let i = 0; i < data.country.length; i++) {
        subFilterDropDown.innerHTML += `<option>
          ${data.country[i].country}
        </option>`;
      }
    } else if (selectedFilter === "cuisine") {
      sortBy = "cuisine";
      subFilterDropDown.innerHTML="<option value>--No Filter--</option>";
      for (let i = 0; i < data.cuisine.length; i++) {
        subFilterDropDown.innerHTML += `<option>
          ${data.cuisine[i].cuisine}
        </option>`;
      }
    }
});
});

//Adding function when clicking the apply filter button:
let clickBtn = document.getElementById("applyFilter");
clickBtn.addEventListener("click", (event) => {
  
  if(subFilterDropDown.value === "")
    {
      alert("You must select a filter to filter! If you wish to clear, click 'Clear filter'");
    }
  pageNumber=0;
  getFilter();
  isFilterApplied = true;
  fetch(`/countFilter?sortBy=${sortBy}&criteria=${subFilterDropDown.value}&page=${pageNumber}&take=${take}`)
  .then((response) => response.json())
  .then((data) => {
    count = data;
    console.log("data",data)
    filterNext();
    displayLabel();
  });
  
});
//To filter the data and to populate the table
function getFilter() {
  
  fetch(
    `/applyFilter?sortBy=${sortBy}&criteria=${subFilterDropDown.value}&page=${pageNumber}&take=${take}`
  )
  .then((response) => response.json())
  .then((data) => {
  table.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    table.innerHTML += `
      <tr>
          <td>${data[i].name}</td>
          <td>${data[i].country}</td>
          <td>${data[i].city}</td>
          <td>${data[i].cuisine}</td>
        </tr>`;
  }
  });

}

//Showing table without applying filter:
function getData() {
  fetch(`/first?page=${pageNumber}&take=${take}`)
  .then((response) => response.json())
  .then((data) => {
  table.innerHTML = "";
  for (let i = 0; i < data.length; i++) 
  {
    table.innerHTML += `
  <tr>
      <td>${data[i].name}</td>
      <td>${data[i].country}</td>
      <td>${data[i].city}</td>
      <td>${data[i].cuisine}</td>
    </tr>`;
  }
  });
};

getData();
disabledPrevious();
mainNext();
displayLabel();

//Making pagination both with apply filter and without apply filter:

//To disabled previous button
function disabledPrevious()
{
 
  if(pageNumber==0)
    document.getElementById("previous").disabled = true;
  else
  {
    document.getElementById("previous").disabled = false;

  }
    
}
//Previous button
document.querySelector("#previous").addEventListener("click", (event) => {
  pageNumber--;
  console.log("previous",pageNumber)
  document.getElementById("next").disabled = false;
  if (isFilterApplied) {
    getFilter();
  } else {
    getData();
  }
  if(pageNumber==0){
    disabledPrevious();
  }    
  else{
    document.getElementById("previous").disabled = false; 
}
displayLabel();
  
});

//To disable next button in main 

function mainNext()
{
  let perPage = document.querySelector("#perPage option:checked").value;
  console.log(perPage);
  
  if(pageNumber==(200/perPage)-1) 
    document.getElementById("next").disabled = true;
  else
  {
    document.getElementById("next").disabled = false;

  }

}

//To disable next button when applying filter
function filterNext()
{
  let perPage = document.querySelector("#perPage option:checked").value;
  
  if (pageNumber>=(count[0].total/perPage)-1)
    document.getElementById("next").disabled = true;
  else
  {
    document.getElementById("next").disabled = false;
  }
}

//Next button

document.querySelector("#next").addEventListener("click", (event) => {
  pageNumber++;
  let perPage = document.querySelector("#perPage option:checked").value;
  if (isFilterApplied) {
    getFilter();
    filterNext();
  } else {
    getData();
  }
  if(pageNumber==((200/perPage) - 1))
    mainNext();
  else{
    disabledPrevious();
    }
       
 displayLabel();
  
});

//PerPage

document.querySelector("#perPage").addEventListener("change", (event) => {
  pageNumber = 0;
  displayLabel();
  let perPage = document.querySelector("#perPage option:checked").value;
  take = perPage;
  if (isFilterApplied) {
    getFilter();
  } else {
    getData();
  }
  disabledPrevious();
  mainNext();
  filterNext();

});

//Clear the data when clicking clear filter button:
let clearBtn = document.getElementById("clearFilter");
clearBtn.addEventListener("click", (event) => {
  window.location.href = `/`;
});

//To display number of results
function displayLabel()
{
  let displayWarning = document.getElementById("warning");
  let perPage = document.querySelector("#perPage option:checked").value;
  skip=(pageNumber*take)+1;
  take=perPage;
  take=parseInt(take);
  if(isFilterApplied)
  {
    if(perPage>count[0].total)
      displayWarning.innerHTML = "Displaying " + skip + " - " + count[0].total + " of " + count[0].total;
    else {
      
      let data = take*(pageNumber+1);
      
      if(data > count[0].total)
      {
        data = count[0].total;
      }
      displayWarning.innerHTML = "Displaying " + skip + " - " + data + " of " + count[0].total;
      }
  }
  
  else
    displayWarning.innerHTML = "Displaying " + skip + " - " +  (take*(pageNumber+1)) + " of " + 200;


 
}
