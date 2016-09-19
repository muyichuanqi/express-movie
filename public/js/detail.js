$(function(){
	$('.comment').click(function(e) {
		var target = $(this);
		var commentId = target.data('cid');//主评论
		var toId = target.data('tid');//主评论评论人

		if($("#cid").length>0){
			$("#cid").val(commentId);
		}else{
			$('<input>').attr({
				type: 'hidden',
				name: 'comment[cid]',
				id:'cid',
				value: commentId
			}).appendTo('#commentForm')
		}

		if($("#tid").length>0){
			$("#tid").val(toId);
		}else{
			$('<input>').attr({
				type: 'hidden',
				name: 'comment[tid]',
				id:'tid',
				value: toId
			}).appendTo('#commentForm')
		}

	})
	
})
