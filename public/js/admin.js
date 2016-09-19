$(function(){
	$('.del').click(function(e){
		var target = $(e.target);
		var id = target.data('id');

		var tr = $('.item-id-' + id);
		var hrefs = window.location.href;
		var url;
		if(/user/.test(hrefs)){
			url = '/admin/user/list?id='
		}else{
			url = '/admin/movie/list?id='
		}

		$.ajax({
			type:'DELETE',
			url:url + id
		})
		.done(function(results){
			if(results.success){
				if(tr.length > 0){
					tr.remove();
					alert("删除成功");
					//window.location.reload();
				}
			}
		})
	})


	//豆瓣获取信息
	$("#inputdouban").blur(function(e){
		var douban = $(this);
		var id = douban.val();
		if(id){
			$.ajax({
				type:'get',
				url:'https://api.douban.com/v2/movie/subject/' + id,
				cache:true,
				dataType:'jsonp',
				crossDomain:true,
				jsonp:'callback',
				success:function(data){
					$("#inputTitle").val(data.title)
					$("#inputDoctor").val(data.directors[0].name)
					$("#inputCountry").val(data.countries[0])
					//$("#inputLanguage").val(data.languages[0])
					$("#inputYear").val(data.year)
					$("#inputSummary").val(data.summary)
					$("#inputPoster").val(data.images.large)
					//$("#inputFlash").val(data.title)
				}
			})
		}	
	})
})