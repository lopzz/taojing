(function(){
	// nav menu
	var dropdown = {};
	$('.menu').on('dropdown-show',function(e){
		dropdown.loadOnce($(this),dropdown.buildMenuItem);
	}).dropdown({
		// event:'click',
		// css3:true,
		js:true,
		animation:'slideUpDown',
		// delay:1000,
		// active:'menu'
	});

	dropdown.buildMenuItem = function($elem,data){
		var html = '';
		if(data.length === 0) return;
		for(var i=0;i<data.length;i++){
			html += '<li><a href="' + data[i].url + '"target="_blank" class="menu-item">' + data[i].name + '</a></li>';
		}
		$elem.find('.dropdown-layer').html(html);
	};
	


	//header search
	var search = {};
	search.$headerSearch = $('#header-search');
	search.$headerSearch.html = '',
	search.$headerSearch.maxNum = 10;
	search.$headerSearch.on('search-getData',function(e,data){
		var $this = $(this);
		search.$headerSearch.html = search.$headerSearch.createHeaderSearchLayer(data,search.$headerSearch.maxNum);
		$this.search('appendLayer',search.$headerSearch.html);
		if(search.$headerSearch.html){
			$this.search('showLayer');
		}else{
			$this.search('hideLayer');
		}
	}).on('search-noData',function(e){
		$(this).search('hideLayer').search('appendLayer','');
	}).on('click','.search-layer-item',function(){
		search.$headerSearch.search('setInputVal',$(this).html());
		search.$headerSearch.search('submit');
	});

	search.$headerSearch.search({
		autocomplete:true,
		// url:'',
		css3:true,
		js:false,
		animation:'fade',
		getDataInterval:200
	});

	search.$headerSearch.createHeaderSearchLayer = function(data,maxNum){
		console.log(data['result'])
		var html = '',
			dataNum = data['result'].length;
		if(dataNum === 0){
			return '';
		}
		for(var i=0; i < dataNum; i++){
			if(i >= maxNum) break;
			html += '<li class="search-layer-item text-ellipsis">' + data['result'][i][0] + '</li>';
		}
		return html;
	};
	

	//header cart //自己写的
	$('.cart').dropdown({
		// event:'click',
		css3:true,
		js:false,
		animation:'fade',
		// delay:1000,
		// active:'menu'
	});

	//focus-category
	$('#focus-category').find('.dropdown')
		.on('dropdown-show',function(){
		  	dropdown.loadOnce($(this),dropdown.createCategoryDetails);
		  })
		.dropdown({
			css3:true,
			js:false,
			animation:'fadeSlideLeftRight',
		});

	dropdown.createCategoryDetails = function($elem,data){
		var html = '';
		for(var i=0;i<data.length;i++){
			html += '<dl class="category-details cf"><dt class="category-details-title fl"><a href="###" target="_blank" class="category-details-title-link">'
					+ data[i].title + '</a></dt><dd class="category-details-item fl">';
			for(var j=0;j<data[i].items.length;j++){
				html += '<a href="###" target="_blank" class="link">' + data[i].items[j] + '</a>';
			}
			html += '</dd></dl>';
		}
		$elem.find('.dropdown-layer').html(html);
	};
	
	dropdown.loadOnce = function($elem,success){
		var dataLoad = $elem.data('load');
		if(!dataLoad) return;
		if(!$elem.data('loaded')){
				$elem.data('loaded',true);
				$.getJSON(dataLoad).done(function(data){
					if(typeof success === 'function') success($elem,data);
				}).fail(function(){
					$elem.data('loaded',false);
				});
		}
	};
	
	//lazy load
	var lazyLoad = {};
	lazyLoad.loadUntil = function (options){
		var items = {},
			loadedItemNum = 0,
			// totalItemNum = $floor.length,
			loadItemFn = null,
			$elem = options.$container,
			id = options.id;
		$elem.on(options.triggerEvent,loadItemFn = function(e,index,elem){
			if(items[index] !== 'loaded'){
				$elem.trigger(id + '-loadItems',[index,elem,function(){
					items[index] = 'loaded';
					loadedItemNum++;
					console.log(index+':loaded');
					if(loadedItemNum === options.totalItemNum){
						//全部东西加载完毕
						$elem.trigger(id + '-itemsLoaded');
					}		
				}]);
			}
		});
		// 	$elem.on(id + '-loadItem',function(e,index,elem){
		// 		// 按需加载
		// 		items[index] = 'loaded';
		// 		loadedItemNum++;
		// 		console.log(index+':loaded');
		// 		if(loadedItemNum === totalItemNum){
		// 			//全部图片加载完毕
		// 			$elem.trigger('floors-itemsLoaded');
		// 		}		
		// 	});
		$elem.on(id + '-itemsLoaded',function(e){
			console.log(id + '-itemsLoaded');
			//清除事件
			$elem.off(options.triggerEvent,loadItemFn);
			// $win.off('scroll resize',timeToShow);
		});
	};
	lazyLoad.isVisible = function isVisible(floorData){//元素是否出现在可视区范围内
		var $win = floor.$win;
		return ($win.height() + $win.scrollTop() > floorData.offsetTop) && ($win.scrollTop() < floorData.offsetTop + floorData.height);
	};
	
	// {
	// 	$container:$elem,
	// 	totalItemNum:5,
	// 	triggerEvent:'floor-show',
	// 	id:'floors'
	// }

	// img loader
	var imgLoader = {};
	imgLoader.loadImg = function(url,imgLoaded,imgFailed){
		var image = new Image();
		image.onerror = function(){
			if(typeof imgLoaded === 'function')	imgFailed(url);
		};
		image.onload = function(){
			if(typeof imgLoaded === 'function')	imgLoaded(url);
		};
		image.src = url;
		// setTimeout(function(){  //模拟加载1s才出图片
		// 	image.src = url;
		// },1000);
	};
	imgLoader.loadImgs = function ($imgs,success,fail){
		$imgs.each(function(_,el){
			var $img = $(el);
			imgLoader.loadImg($img.data('src'),function(url){
				$img.attr('src',url);
				success();
			},function(url){
				console.log('从' + url + '加载图片失败');
				fail($img,url)
			});
		});
	};

	//focus-slider
	var slider = {};
	slider.$focusSlider = $('#focus-slider');

	slider.$focusSlider.on('focus-loadItems',function(e,index,elem,success){
		imgLoader.loadImgs($(elem).find('.slider-img'),success,function($img,url){
			$img.attr('src','img/focus-slider/placeholder.png');
		});
	});
	lazyLoad.loadUntil({
				$container:slider.$focusSlider,
				totalItemNum:slider.$focusSlider.find('.slider-img').length,
				triggerEvent:'slider-show',
				id:'focus'
	});
	slider.$focusSlider.slider({
		css3:true,
		js:false,
		animation:'fade',
		activeIndex:0,
		interval:0,
	});

	//todays-slider
	slider.$todaysSlider = $('#todays-slider');
	
	slider.$todaysSlider.on('todays-loadItems',function(e,index,elem,success){
		imgLoader.loadImgs($(elem).find('.slider-img'),success,function($img,url){
			$img.attr('src','img/todays-slider/placeholder.png');
		});
	});
	lazyLoad.loadUntil({
				$container:slider.$todaysSlider,
				totalItemNum:slider.$todaysSlider.find('.slider-img').length,
				triggerEvent:'slider-show',
				id:'todays'
	});

	slider.$todaysSlider.slider({
		css3:true,
		js:false,
		animation:'slide',
		activeIndex:0,
		interval:0,
	});


	//floor
	var floor = {};
	floor.$floor = $('.floor');

	// function lazyLoadFloorImgs($elem){
	// 	var items = {},
	// 		loadedItemNum = 0,
	// 		totalItemNum = $elem.find('.floor-img').length,
	// 		loadItemFn = null;
	// 	$elem.on('tab-show',loadItemFn = function(e,index,elem){
	// 		if(items[index] !== 'loaded'){
	// 			$elem.trigger('tab-loadItem',[index,elem]);
	// 		}
	// 	});
	// 	$elem.on('tab-loadItem',function(e,index,elem){
	// 			// 按需加载
	// 			var $imgs = $(elem).find('.floor-img');
	// 			$imgs.each(function(_,el){
	// 				var $img = $(el);
	// 				slider.loadImg($img.data('src'),function(url){
	// 					$img.attr('src',url);
	// 					items[index] = 'loaded';
	// 					loadedItemNum++;
	// 					console.log(index+':loaded');
	// 					if(loadedItemNum === totalItemNum){
	// 						//全部图片加载完毕
	// 						$elem.trigger('tab-itemsLoaded');
	// 					}
	// 				},function(url){
	// 					console.log('从' + url + '加载图片失败');
	// 					//显示备用图片
	// 					$img.attr('src','img/floor/placeholder.png');
	// 				});
	// 			});
				
	// 	});
	// 	$elem.on('tab-itemsLoaded',function(e){
	// 		console.log('tab-itemsLoaded');
	// 		//清除事件
	// 		$elem.off('tab-show',loadItemFn);
	// 	});
	// };

	// $floor.each(function(_,elem){
	// 	lazyLoadFloorImgs($(elem));
	// });

	// $floor.tab({
	// 	event:'mouseenter',//click
	// 	css3:false,
	// 	js:false,
	// 	animation:'fade',
	// 	activeIndex:0,
	// 	interval:0,
	// 	delay:500
	// });
	
	floor.floorData = [
		{
			num:1,
			text:'服装鞋包',
			tabs:['大牌','男装','女装'],
			offsetTop:floor.$floor.eq(0).offset().top,
			height:floor.$floor.eq(0).height(),
			items:[
					[
						{
							name:'吉普男士2020透气运动套装',
							price:229
						},
						{
							name:'2020夏装新款哈伦裤九分裤',
							price:39.9
						},
						{
							name:'夏季速干休闲运动两件套跑步服',
							price:38
						},{
							name:'乐拖家居拖鞋',
							price:16.9
						},{
							name:'雅鹿男青年商务休闲衬衣',
							price:89
						},{
							name:'范思蓝恩夏季简约印花短袖T恤',
							price:99
						},{
							name:'乔丹新款男装运动裤五分裤短裤',
							price:58
						},{
							name:'蔻驰女士PVC手提单肩托特包',
							price:2480
						},{
							name:'回力一脚蹬男鞋',
							price:79
						},{
							name:'南极人短袖t恤',
							price:258
						},{
							name:'短袖中长款t恤裙女打底衫',
							price:98
						},{
							name:'定制款5D舒适缓震透气休闲鞋',
							price:99
						}
					],
					[
						{
							name:'瑞族公社夏季印花打底衫',
							price:68
						},
						{
							name:'尊尚鸟短袖T恤潮流短袖',
							price:68
						},
						{
							name:'宽松短袖男生纯色纯棉T恤',
							price:89
						},{
							name:'宽松纯色纯棉T恤五分袖',
							price:59
						},{
							name:'男半袖夏天五分袖打底衫上衣',
							price:87
						},{
							name:'2020休闲立领t恤修身打底衫',
							price:125
						},{
							name:'新品运动系列吸湿透气短裤',
							price:128
						},{
							name:'海澜之家前胸图案半袖短袖',
							price:78
						},{
							name:'凯恩坎普短袖T恤',
							price:69
						},{
							name:'海澜之家运动系列圆领短袖T恤',
							price:78
						},{
							name:'森成名品短袖t恤男士Polo衫',
							price:99
						},{
							name:'泉色短袖T恤男装夏季新款衣服',
							price:68
						}
					],
					[
						{
							name:'欧莎OSA白色v领半袖上衣',
							price:189
						},
						{
							name:'棉麻韩版宽松显瘦休闲短袖',
							price:128
						},
						{
							name:'显瘦休闲中长碎花裙子',
							price:128
						},{
							name:'2020夏季新款韩版牛仔',
							price:138
						},{
							name:'碎花雪纺棉麻裙子',
							price:138
						},{
							name:'时尚潮港味小雏菊短裙',
							price:148
						},{
							name:'收腰显瘦高端过膝a字长裙',
							price:598
						},{
							name:'2020春夏季新款亚麻打底',
							price:89
						},{
							name:'夏两件套2020春夏新款大',
							price:118
						},{
							name:'汉服收腰显瘦雪纺性感裙子',
							price:138
						},{
							name:'小个子碎花连衣裙蕾丝',
							price:149
						},{
							name:'范思蓝恩春秋新款雪纺白衬衫',
							price:169
						}
					]
				  ]
		},
		{
			num:2,
			text:'个护美妆',
			tabs:['热门','国际大牌','国际名品'],
			offsetTop:floor.$floor.eq(1).offset().top,
			height:floor.$floor.eq(1).height(),
			items:[
					[
						{
							name:'吉普男士2020透气运动套装',
							price:229
						},
						{
							name:'2020夏装新款哈伦裤九分裤',
							price:39.9
						},
						{
							name:'夏季速干休闲运动两件套跑步服',
							price:38
						},{
							name:'乐拖家居拖鞋',
							price:16.9
						},{
							name:'雅鹿男青年商务休闲衬衣',
							price:89
						},{
							name:'范思蓝恩夏季简约印花短袖T恤',
							price:99
						},{
							name:'乔丹新款男装运动裤五分裤短裤',
							price:58
						},{
							name:'蔻驰女士PVC手提单肩托特包',
							price:2480
						},{
							name:'回力一脚蹬男鞋',
							price:79
						},{
							name:'南极人短袖t恤',
							price:258
						},{
							name:'短袖中长款t恤裙女打底衫',
							price:98
						},{
							name:'定制款5D舒适缓震透气休闲鞋',
							price:99
						}
					],
					[
						{
							name:'瑞族公社夏季印花打底衫',
							price:68
						},
						{
							name:'尊尚鸟短袖T恤潮流短袖',
							price:68
						},
						{
							name:'宽松短袖男生纯色纯棉T恤',
							price:89
						},{
							name:'宽松纯色纯棉T恤五分袖',
							price:59
						},{
							name:'男半袖夏天五分袖打底衫上衣',
							price:87
						},{
							name:'2020休闲立领t恤修身打底衫',
							price:125
						},{
							name:'新品运动系列吸湿透气短裤',
							price:128
						},{
							name:'海澜之家前胸图案半袖短袖',
							price:78
						},{
							name:'凯恩坎普短袖T恤',
							price:69
						},{
							name:'海澜之家运动系列圆领短袖T恤',
							price:78
						},{
							name:'森成名品短袖t恤男士Polo衫',
							price:99
						},{
							name:'泉色短袖T恤男装夏季新款衣服',
							price:68
						}
					],
					[
						{
							name:'欧莎OSA白色v领半袖上衣',
							price:189
						},
						{
							name:'棉麻韩版宽松显瘦休闲短袖',
							price:128
						},
						{
							name:'显瘦休闲中长碎花裙子',
							price:128
						},{
							name:'2020夏季新款韩版牛仔',
							price:138
						},{
							name:'碎花雪纺棉麻裙子',
							price:138
						},{
							name:'时尚潮港味小雏菊短裙',
							price:148
						},{
							name:'收腰显瘦高端过膝a字长裙',
							price:598
						},{
							name:'2020春夏季新款亚麻打底',
							price:89
						},{
							name:'夏两件套2020春夏新款大',
							price:118
						},{
							name:'汉服收腰显瘦雪纺性感裙子',
							price:138
						},{
							name:'小个子碎花连衣裙蕾丝',
							price:149
						},{
							name:'范思蓝恩春秋新款雪纺白衬衫',
							price:169
						}
					]
				  ]
		},
		{
			num:3,
			text:'手机通讯',
			tabs:['热门','品质优选','新机尝鲜'],
			offsetTop:floor.$floor.eq(2).offset().top,
			height:floor.$floor.eq(2).height(),
		items:[
					[
						{
							name:'吉普男士2020透气运动套装',
							price:229
						},
						{
							name:'2020夏装新款哈伦裤九分裤',
							price:39.9
						},
						{
							name:'夏季速干休闲运动两件套跑步服',
							price:38
						},{
							name:'乐拖家居拖鞋',
							price:16.9
						},{
							name:'雅鹿男青年商务休闲衬衣',
							price:89
						},{
							name:'范思蓝恩夏季简约印花短袖T恤',
							price:99
						},{
							name:'乔丹新款男装运动裤五分裤短裤',
							price:58
						},{
							name:'蔻驰女士PVC手提单肩托特包',
							price:2480
						},{
							name:'回力一脚蹬男鞋',
							price:79
						},{
							name:'南极人短袖t恤',
							price:258
						},{
							name:'短袖中长款t恤裙女打底衫',
							price:98
						},{
							name:'定制款5D舒适缓震透气休闲鞋',
							price:99
						}
					],
					[
						{
							name:'瑞族公社夏季印花打底衫',
							price:68
						},
						{
							name:'尊尚鸟短袖T恤潮流短袖',
							price:68
						},
						{
							name:'宽松短袖男生纯色纯棉T恤',
							price:89
						},{
							name:'宽松纯色纯棉T恤五分袖',
							price:59
						},{
							name:'男半袖夏天五分袖打底衫上衣',
							price:87
						},{
							name:'2020休闲立领t恤修身打底衫',
							price:125
						},{
							name:'新品运动系列吸湿透气短裤',
							price:128
						},{
							name:'海澜之家前胸图案半袖短袖',
							price:78
						},{
							name:'凯恩坎普短袖T恤',
							price:69
						},{
							name:'海澜之家运动系列圆领短袖T恤',
							price:78
						},{
							name:'森成名品短袖t恤男士Polo衫',
							price:99
						},{
							name:'泉色短袖T恤男装夏季新款衣服',
							price:68
						}
					],
					[
						{
							name:'欧莎OSA白色v领半袖上衣',
							price:189
						},
						{
							name:'棉麻韩版宽松显瘦休闲短袖',
							price:128
						},
						{
							name:'显瘦休闲中长碎花裙子',
							price:128
						},{
							name:'2020夏季新款韩版牛仔',
							price:138
						},{
							name:'碎花雪纺棉麻裙子',
							price:138
						},{
							name:'时尚潮港味小雏菊短裙',
							price:148
						},{
							name:'收腰显瘦高端过膝a字长裙',
							price:598
						},{
							name:'2020春夏季新款亚麻打底',
							price:89
						},{
							name:'夏两件套2020春夏新款大',
							price:118
						},{
							name:'汉服收腰显瘦雪纺性感裙子',
							price:138
						},{
							name:'小个子碎花连衣裙蕾丝',
							price:149
						},{
							name:'范思蓝恩春秋新款雪纺白衬衫',
							price:169
						}
					]
				  ]
		},
		{
			num:4,
			text:'家用电器',
			tabs:['热门','大家电','生活电器'],
			offsetTop:floor.$floor.eq(3).offset().top,
			height:floor.$floor.eq(3).height(),
			items:[
					[
						{
							name:'吉普男士2020透气运动套装',
							price:229
						},
						{
							name:'2020夏装新款哈伦裤九分裤',
							price:39.9
						},
						{
							name:'夏季速干休闲运动两件套跑步服',
							price:38
						},{
							name:'乐拖家居拖鞋',
							price:16.9
						},{
							name:'雅鹿男青年商务休闲衬衣',
							price:89
						},{
							name:'范思蓝恩夏季简约印花短袖T恤',
							price:99
						},{
							name:'乔丹新款男装运动裤五分裤短裤',
							price:58
						},{
							name:'蔻驰女士PVC手提单肩托特包',
							price:2480
						},{
							name:'回力一脚蹬男鞋',
							price:79
						},{
							name:'南极人短袖t恤',
							price:258
						},{
							name:'短袖中长款t恤裙女打底衫',
							price:98
						},{
							name:'定制款5D舒适缓震透气休闲鞋',
							price:99
						}
					],
					[
						{
							name:'瑞族公社夏季印花打底衫',
							price:68
						},
						{
							name:'尊尚鸟短袖T恤潮流短袖',
							price:68
						},
						{
							name:'宽松短袖男生纯色纯棉T恤',
							price:89
						},{
							name:'宽松纯色纯棉T恤五分袖',
							price:59
						},{
							name:'男半袖夏天五分袖打底衫上衣',
							price:87
						},{
							name:'2020休闲立领t恤修身打底衫',
							price:125
						},{
							name:'新品运动系列吸湿透气短裤',
							price:128
						},{
							name:'海澜之家前胸图案半袖短袖',
							price:78
						},{
							name:'凯恩坎普短袖T恤',
							price:69
						},{
							name:'海澜之家运动系列圆领短袖T恤',
							price:78
						},{
							name:'森成名品短袖t恤男士Polo衫',
							price:99
						},{
							name:'泉色短袖T恤男装夏季新款衣服',
							price:68
						}
					],
					[
						{
							name:'欧莎OSA白色v领半袖上衣',
							price:189
						},
						{
							name:'棉麻韩版宽松显瘦休闲短袖',
							price:128
						},
						{
							name:'显瘦休闲中长碎花裙子',
							price:128
						},{
							name:'2020夏季新款韩版牛仔',
							price:138
						},{
							name:'碎花雪纺棉麻裙子',
							price:138
						},{
							name:'时尚潮港味小雏菊短裙',
							price:148
						},{
							name:'收腰显瘦高端过膝a字长裙',
							price:598
						},{
							name:'2020春夏季新款亚麻打底',
							price:89
						},{
							name:'夏两件套2020春夏新款大',
							price:118
						},{
							name:'汉服收腰显瘦雪纺性感裙子',
							price:138
						},{
							name:'小个子碎花连衣裙蕾丝',
							price:149
						},{
							name:'范思蓝恩春秋新款雪纺白衬衫',
							price:169
						}
					]
				  ]
		},
		{
			num:5,
			text:'电脑数码',
			tabs:['热门','电脑/平板','潮流影音'],
			offsetTop:floor.$floor.eq(4).offset().top,
			height:floor.$floor.eq(4).height(),
			items:[
					[
						{
							name:'吉普男士2020透气运动套装',
							price:229
						},
						{
							name:'2020夏装新款哈伦裤九分裤',
							price:39.9
						},
						{
							name:'夏季速干休闲运动两件套跑步服',
							price:38
						},{
							name:'乐拖家居拖鞋',
							price:16.9
						},{
							name:'雅鹿男青年商务休闲衬衣',
							price:89
						},{
							name:'范思蓝恩夏季简约印花短袖T恤',
							price:99
						},{
							name:'乔丹新款男装运动裤五分裤短裤',
							price:58
						},{
							name:'蔻驰女士PVC手提单肩托特包',
							price:2480
						},{
							name:'回力一脚蹬男鞋',
							price:79
						},{
							name:'南极人短袖t恤',
							price:258
						},{
							name:'短袖中长款t恤裙女打底衫',
							price:98
						},{
							name:'定制款5D舒适缓震透气休闲鞋',
							price:99
						}
					],
					[
						{
							name:'瑞族公社夏季印花打底衫',
							price:68
						},
						{
							name:'尊尚鸟短袖T恤潮流短袖',
							price:68
						},
						{
							name:'宽松短袖男生纯色纯棉T恤',
							price:89
						},{
							name:'宽松纯色纯棉T恤五分袖',
							price:59
						},{
							name:'男半袖夏天五分袖打底衫上衣',
							price:87
						},{
							name:'2020休闲立领t恤修身打底衫',
							price:125
						},{
							name:'新品运动系列吸湿透气短裤',
							price:128
						},{
							name:'海澜之家前胸图案半袖短袖',
							price:78
						},{
							name:'凯恩坎普短袖T恤',
							price:69
						},{
							name:'海澜之家运动系列圆领短袖T恤',
							price:78
						},{
							name:'森成名品短袖t恤男士Polo衫',
							price:99
						},{
							name:'泉色短袖T恤男装夏季新款衣服',
							price:68
						}
					],
					[
						{
							name:'欧莎OSA白色v领半袖上衣',
							price:189
						},
						{
							name:'棉麻韩版宽松显瘦休闲短袖',
							price:128
						},
						{
							name:'显瘦休闲中长碎花裙子',
							price:128
						},{
							name:'2020夏季新款韩版牛仔',
							price:138
						},{
							name:'碎花雪纺棉麻裙子',
							price:138
						},{
							name:'时尚潮港味小雏菊短裙',
							price:148
						},{
							name:'收腰显瘦高端过膝a字长裙<',
							price:598
						},{
							name:'2020春夏季新款亚麻打底',
							price:89
						},{
							name:'夏两件套2020春夏新款大',
							price:118
						},{
							name:'汉服收腰显瘦雪纺性感裙子',
							price:138
						},{
							name:'小个子碎花连衣裙蕾丝',
							price:149
						},{
							name:'范思蓝恩春秋新款雪纺白衬衫',
							price:169
						}
					]
				  ]
		}
	];


	// function lazyLoadFloor(){
	// 	var items = {},
	// 		loadedItemNum = 0,
	// 		totalItemNum = $floor.length,
	// 		loadItemFn = null;
	// 	$doc.on('floor-show',loadItemFn = function(e,index,elem){
	// 		if(items[index] !== 'loaded'){
	// 			$doc.trigger('floors-loadItem',[index,elem]);
	// 		}
	// 	});
	// 	$doc.on('floors-loadItem',function(e,index,elem){
	// 		// 按需加载
	// 		var html = buildFloor(floorData[index]),
	// 			$elem = $(elem);
	// 		items[index] = 'loaded';
	// 		loadedItemNum++;
	// 		console.log(index+':loaded');
	// 		if(loadedItemNum === totalItemNum){
	// 			//全部图片加载完毕
	// 			$doc.trigger('floors-itemsLoaded');
	// 		}
	// 		setTimeout(function(){
	// 			$elem.html(html);
	// 			lazyLoadFloorImgs($elem);
	// 			$elem.tab({
	// 				event:'mouseenter',//click
	// 				css3:false,
	// 				js:false,
	// 				animation:'fade',
	// 				activeIndex:0,
	// 				interval:0,
	// 				delay:500
	// 			});
	// 		},1000);
				
	// 	});
	// 	$doc.on('floors-itemsLoaded',function(e){
	// 		console.log('floors-itemsLoaded');
	// 		//清除事件
	// 		$doc.off('floor-show',loadItemFn);
	// 		$win.off('scroll resize',timeToShow);
	// 	});
	// };

	
	floor.buildFloor = function (floorData){
		var html = '';
		html += '<div class="container">';
		html += floor.buildFloorHead(floorData);
		html += floor.buildFloorBody(floorData);
		html += '</div>';
		return html;
	};
	
	floor.buildFloorHead = function (floorData){
		var html = '';
		html += '<div class="floor-head">';
		html +=	'<h2 class="floor-title fl"><span class="floor-title-num">' + floorData.num + 'F</span><span class="floor-title-text">' + floorData.text + '</span></h2>';
		html +=	'<ul class="tab-item-wrap fr">';
		for(var i = 0; i < floorData.tabs.length;i++){
			html += '<li class="fl"><a href="javascript:;" class="tab-item">' + floorData.tabs[i] + '</a></li>';
			if(i !== floorData.tabs.length - 1){
				html += '<li class="floor-divider fl text-hidden">分割线</li>';
			}
		}		
		html +=	'</ul>';
		html +=	'</div>';
		return html;
	};
	
	floor.buildFloorBody = function (floorData){
		var html = '';
		html += '<div class="floor-body">';
		for(var i = 0; i < floorData.items.length; i++){
			html += '<ul class="tab-panel">';
			for(var j = 0; j < floorData.items[i].length; j++){
				html += '<li class="floor-item fl">';
				html += '<p class="floor-item-pic"><a href="###" target="_blank"><img src="img/floor/loading.gif" class="floor-img" data-src="img/floor/' + floorData.num +'/' + (i+1) +'/' + (j+1) +'.png" alt=""></a></p>';
				html += '<p class="floor-item-name"><a href="###" target="_blank" class="link">' + floorData.items[i][j].name +'</a></p>';
				html += '<p class="floor-item-price">￥' + floorData.items[i][j].price +'</p>';
				html += '</li>';
			}
			html += '</ul>';
		}		
		html += '</div>';
		return html;
	};
	

	floor.$win = $(window);
	floor.$doc = $(document);
	
	floor.timeToShow = function (){
		// console.log('time to show');
		floor.$floor.each(function(index,elem){
			if(lazyLoad.isVisible(floor.floorData[index])){
				console.log('the '+(index+1)+' floor is visible');
				floor.$doc.trigger('floor-show',[index,elem]);
			}
		});
	};
	

	floor.$win.on('scroll resize',floor.showFloor = function(){
		clearTimeout(floor.floorTimer);
		floor.floorTimer = setTimeout(floor.timeToShow,250);
	});


	floor.$floor.on('floor-loadItems',function(e,index,elem,success){
		imgLoader.loadImgs($(elem).find('.floor-img'),success,function($img,url){
			$img.attr('src','img/floor/placeholder.png');
		});
	});
	floor.$doc.on('floors-loadItems',function(e,index,elem,success){
		var html = floor.buildFloor(floor.floorData[index]),
			$elem = $(elem);
		success();
		// setTimeout(function(){  //一秒后才显示floor的东西
		// 	$elem.html(html);
		// 	lazyLoad.loadUntil({
		// 		$container:$elem,
		// 		totalItemNum:$elem.find('.floor-img').length,
		// 		triggerEvent:'tab-show',
		// 		id:'floor'
		// 	});
		// 	$elem.tab({
		// 		event:'mouseenter',//click
		// 		css3:false,
		// 		js:false,
		// 		animation:'fade',
		// 		activeIndex:0,
		// 		interval:0,
		// 		delay:500
		// 	});
		// },1000);
		$elem.html(html);
		lazyLoad.loadUntil({
			$container:$elem,
			totalItemNum:$elem.find('.floor-img').length,
			triggerEvent:'tab-show',
			id:'floor'
		});
		$elem.tab({
			event:'mouseenter',//click
			css3:true,
			js:false,
			animation:'fade',
			activeIndex:0,
			interval:0,
			delay:500
		});
		
	});
	floor.$doc.on('floors-itemsLoaded',function(){
		floor.$win.off('scroll resize',floor.showFloor);
	});
	lazyLoad.loadUntil({
		$container:floor.$doc,
		totalItemNum:floor.$floor.length,
		triggerEvent:'floor-show',
		id:'floors'
	});
	floor.timeToShow();

	// elevator
	floor.whichFloor = function(){
		var num = -1;
		floor.$floor.each(function(index,elem){
			var floorData = floor.floorData[index];
			num = index;
			if(floor.$win.scrollTop() + floor.$win.height()/2 < floorData.offsetTop){
				num = index - 1;
				return false;
			}
		});
		return num;
	};
	// console.log(floor.whichFloor());

	floor.$elevator = $('#elevator');
	floor.$elevator.$items = floor.$elevator.find('.elevator-item');
	floor.setElevator = function(){
		var num = floor.whichFloor();
		if(num === -1){ // hide
			floor.$elevator.fadeOut();
		}else{ //show
			floor.$elevator.fadeIn();
			floor.$elevator.$items.removeClass('elevator-active');
			floor.$elevator.$items.eq(num).addClass('elevator-active');
		}
	};
	floor.setElevator();

	floor.$win.on('scroll resize',function(){
		clearTimeout(floor.elevatorTimer);
		floor.elevatorTimer = setTimeout(floor.setElevator,250);
	});

	floor.$elevator.on('click','.elevator-item',function(){
		$('html,body').animate({
			scrollTop:floor.floorData[$(this).index()].offsetTop
		});
	});

	$('#backToTop').on('click',function(){
		$('html,body').animate({
			scrollTop:0
		});
	});	

})(jQuery);