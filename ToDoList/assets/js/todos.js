//check off the itenm
$("ul").on("click", "li", function(){
    $(this).toggleClass("completed");    
});

//click Delete to delete item
$("ul").on("click", "span", function(event){
    $(this).parent().fadeOut(100, function(){
        $(this).remove();
    });
    event.stopPropagation();
});

//new item
$("input[type = 'text']").keypress(function(event){
    if(event.which === 13){
        //grabing the new todo text!
        var todoText = $(this).val();
        $(this).val("");
        $("ul").append(`<li><span><i class="fa fa-trash"></i></span> ${todoText}</li>`);
    }
});

//toggle for input
$(".fa-plus").on("click", function(){
    $("input[type = 'text']").fadeToggle(100, function(){

    })
})