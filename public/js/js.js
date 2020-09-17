let lists = [];
let mainPage = true;
let hideCompleted = false;
let search = false;
let listId = 0;
let itemId = 0;
let listIndex;

// :::::ICONS::::::

// Plus - toggle input
$(".fa-plus-circle").click(function(){
    $("input[type='text']").val("");
    if(!search){
        $("input[type='text']").fadeToggle("medium", "linear");  
        $("input[type='text']").toggleClass("hide");
    }
    search = false;
    inputPlaceholder();
    listContent();
});

// Minus - show/hide trashcan
$(".fa-minus-circle").on("click", function(){
    $("ul li span").fadeToggle("slow", "linear"); 
    $("ul li span").toggleClass("hide");
});

// Search - show/hide search form
$(".fa-search").click(function(){
    $("input[type='text']").val("");
    $("input[type='text']").attr("placeholder", "");
    if(!$("input[type='text']").hasClass("hide") && !search){
        // Don't toggle if input is displayed and search is false
    } else {
        $("input[type='text']").fadeToggle("medium", "linear");
        $("input[type='text']").toggleClass("hide");
    }
    search = !search;
    $("li").remove();
    listContent();
});

// Checked - show/hide checked items
$(".fa-check-circle").on("click", function(){
    hideCompleted = !hideCompleted;
    showCompleted();
	liBgColor();
});

// Arrow - return to main page
$(".fa-arrow-circle-left").click(function(){
    mainPage = true;
    displayIcons();
    showLists();
    inputPlaceholder();
});


// :::::TEXT INPUT::::::

// Input - Add
$("input[type='text']").keypress(function(event){
    if(!search && event.which === 13 && $(this).val() !== ""){
        let input = $(this).val();
        let text = input.substr(0,1).toUpperCase() + input.substr(1);
        addToArray(text);
        $(this).val("");
        // Hide trashcan icons
        $("li span").css("display", "none");
    }
});

// Input - Search
$("input[type='text']").on("keyup", function(event){
    if(search){
        $("li").remove();
        if($(this).val() !== ""){
            let input = event.target.value.toLowerCase();
            searchLogic(input);
        }
        liBgColor();
    }
});


// :::::LIST:::::

// Click on li - open list VS. check off item
$("ul").on("click", "li", function(){
    let id = $(this).attr("id");
    if(id > 0){
        $(this).toggleClass("complete");
        if(hideCompleted){
            $(this).fadeOut();
        }
        updateCompletedToArray(id);      
    }else{
        findListIndex(id);
        showItems(listIndex);
        displayIcons();
    }
    $("input[type='text']").val("");
    inputPlaceholder();
});

// Trashcan - delete list/item
$("ul").on("click", "li span", function(event){
    $(this).parent().fadeOut(function(){
        let id = Number($(this).attr("id"));
        if(id < 0){
            deleteList(id);
        }else{
            deleteItem(id);
        }
        $(this).remove();
    });
    event.stopPropagation();
});


// ::::: Functions :::::

function addToArray(text){
    if(mainPage){
        let id = listId -=1;
        let listItems = [];
        lists.unshift({title: text, id: id, listItems: listItems});
        showLists();
    } else {
        let id = itemId +=1;
        let item = {item: text, id: id, completed: false}
        lists[listIndex].listItems.unshift(item);
        showItems(listIndex);
    }
    liBgColor();
}

function updateCompletedToArray(id){
    $.each(lists, function(indxex, value){
        $.each(lists[indxex].listItems, function(indx, val){
            if(val.id == id){
                if(val.completed === false){
                    val.completed = true;
                }else{
                    val.completed = false;
                }
            }
        });
    });
} 

function displayIcons(){
    if(mainPage){
        $(".mainListIcons").addClass("hide");
    }else{
        $(".mainListIcons").removeClass("hide");
    }
}

function showLists(){
    mainPage = true;
    $("li").remove();
    $.each(lists, function(indx, val){
        $("ul").append("<li id='" + val.id + "'> <span class='hide'> <i class='far fa-trash-alt'></i> </span> <strong>" + val.title + "</strong> </li>");
    });
    $("h3").text("Lists");
    liBgColor();
}

function showItems(listIndex){
    mainPage = false;
    $("li").remove();
    $.each(lists[listIndex].listItems, function(indx, val){
        if(val.completed !== true){
            $("ul").append("<li id='" + val.id + "'> <span class='hide'> <i class='far fa-trash-alt'></i> </span>" + val.item + "</li>");
        } else{
            $("ul").append("<li id='" + val.id + "' class='complete'> <span class='hide'> <i class='far fa-trash-alt'></i> </span>" + val.item + "</li>");
        }
    });    
    $("h3").text(lists[listIndex].title);
    showCompleted();
    liBgColor();
}

function listContent(){
    if(mainPage){
        showLists();
    } else {
        showItems(listIndex);
    }
    if(search){
        $("h3").text("Find");
    }
}

function showCompleted(){
    $("li").each(function(){
        if(hideCompleted){
            $(".complete").addClass("hide");
        } else {
            $(".complete").removeClass("hide");
        }
    });
}

function inputPlaceholder(){
    if(!search){
        if(mainPage){
            $("input[type='text']").attr("placeholder", "Create List");
        }else{
            $("input[type='text']").attr("placeholder", "Add Item");
        }
    }else{
        $("input[type='text']").attr("placeholder", "");
    }
}

function searchLogic(input){
    // Search list titles
    $.each(lists, function(indx, val){
        if(val.title.toLowerCase().indexOf(input) != -1){
            $("ul").append("<li id='" + val.id + "'> <span class='hide'> <i class='far fa-trash-alt'></i> </span> <strong>" + val.title + "</strong> </li>");
        }
    });
    // Search list items
    $.each(lists,function(indx){
        $.each(lists[indx].listItems, function(indx, val){
            if(val.item.toLowerCase().indexOf(input) != -1){
                // Display as completed or uncompleted
                if(val.completed !== true){
                    $("ul").append("<li id='" + val.id + "'> <span class='hide'> <i class='far fa-trash-alt'></i> </span>" + val.item + "</li>");
                } else{
                    $("ul").append("<li id='" + val.id + "' class='complete'> <span class='hide'> <i class='far fa-trash-alt'></i> </span>" + val.item + "</li>");
                }
            }
        });
    });
}

function findListIndex(id){
    $.each(lists, function(indx, val){
        if(id == val.id){
            listIndex = indx;
            return listIndex;
        }else{
            $.each(lists[indx].listItems, function(index, value){
                if(val.id == id){
                    listIndex = indx;
                    return listIndex;
                }
            })
        }
    });
}

function deleteList(id){
    $.each(lists, function(indx, val){
        if(val.id == id){
            lists.splice(indx, 1);
        }
    });
}

function deleteItem(id){
    findListIndex(id);
    $.each(lists[listIndex].listItems, function(indx, val){
        if(val.id == id){
            lists[listIndex].listItems.splice(indx, 1);
        }
    });
}

// Set gray bg to every second li
function liBgColor() {
    if(hideCompleted){
        $("li:visible").each(function(indx){
            if(indx % 2 !== 0){
                $(this).css("background-color", "#f5f7f7");
            }else{
				$(this).css("background-color", "white");
			}
        });
    } else {
        $("li").each(function(indx){
            if(indx % 2 !== 0){
                $(this).css("background-color", "#f5f7f7");
            }else{
				$(this).css("background-color", "white");
			}
        });
    }
}