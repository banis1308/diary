/**
 * 
 */

$(function() {
	// 키워드 검색 요청 변수
	var searchSettings = {
		  'coll'				: []
		, 'channel'				: 'cms_kr'
		, 'query'				: $('#schString').val()
		, 'sort'				: 'date'
		, 'page_no'				: '1'
		, 'page_size'			: $('#listLength').val()
		, 'contents_attribute'	: 'A'
		, 'contents_type'		: 'KR'
		, 'lang_type'			: 'KR'
		, 'coll'				: ''
		, 'result'				: 'detail'
		, 'result_style'		: 'json'
	};

	var nowLang = '';	// 현재 메뉴의 언어를 저장한다.
	var item = {};		// 검색 결과(객체)를 저장하는 변수
	var type = '';		// 현재 선택된 메뉴의 이름을 저장할 변수(ex) Article, People, Photo, Mpic...)
	
	$.searchAjax = function(_option){
		var option = $.extend({
			  url : "/cms/search/searchReq.do"
			, type : "POST"
			, data : apiData
		},_option);
		return $.ajax(option);
	}
	console.debug('affffffffffffffffffff', window.drawArr);
	/****************************
	 * 검색 결과 관련
	 ****************************/
	$('#content_container')
		.data('drawOrder', window.drawArr)
		.bind('init', function() {
			var initName = 'init' + $._cms_search.categoryItem.key;
			//console.log(initName);
			$('#content_container').html($("#"+initName).html());
			
			// FIXME 메뉴 별 api data 초기화
			$(this).data('data', $.extend({
				lang_type: $._cms_search.lang || 'kr',
				page_no: 1,
				initView : initName
			}, searchSettings));
		})
		.bind('search', function(e, _option) {
			
			$(this).data('data', $.extend($(this).data('data'), _option));
			
			//console.debug('search Request;;;;;;;;;;;',$(this).data());
//			$(this).empty().removeClass('content_container40 result_con40').addClass('result_con');
//			// 인기 검색어의 줄 제거 및 인기, 연관검색어 칸 간격 조정
			$('.AreaContainer01').find('div.searchKey:eq(0)').addClass('lineB0');
			
			var self = this;
			$(this).triggerHandler('load').then(function(response) {
				var item = {};
				if (typeof response === 'string' && response.startsWith('{') && response.endsWith('}')) {
					response = JSON.parse(response);
				}
				
				$.item = response;
				var _temp = {};
				$.each($(self).data('drawOrder'), function(i, _key) {
					console.debug(_key, Object.keys(response), $.inArray(_key, Object.keys(response)))
					if ($.inArray(_key, Object.keys(response)) > -1) {
						_temp[_key] = response[_key];
					}
				});
				
				$.each(Object.keys(_temp), function(i, __itemKey) {
					console.log(i);
					console.debug(__itemKey);
					var __item = response[__itemKey];
					//$(self).triggerHandler('draw', [__itemKey, __item]);
					console.debug('hi _ this ? ', this, __item, $(self).data('data')['lang_type']);
					//debugger;
					console.log(drawActions['draw_'+__itemKey]);
					drawActions['draw_' + __itemKey].apply(this, [__item, $(self).data('data')['lang_type']]);
					//debugger;
					
					if(!($._cms_search.categoryItem.key.indexOf('All') != -1)){
						// 페이징 적용
						$("#pagination").pagination({
							page: __item['page_no'] || 1, 
							total : __item['totalCount'] || 0, 
							rows: __item['page_size'] || 10, 
							onChange : function(e, page){
								$('.list_Container').empty();
								$(self).triggerHandler('search', {page_no: page});
							}
						});
					}
				});
			});
		})
		.bind('load', function() {
			console.log($(this).data('data'));
			var option = $.extend({
				  url : "/cms/search/searchReq.do"
				, type : "POST"
				, data : $(this).data('data')
			}, {});
			
			return $.ajax(option);
		});
	
	/*************************
	 * draw 함수 적용
	 *************************/
	var drawActions = {
		draw_KR_ARTICLE: function(data, lang) {
			drawActions.drawCommonArticle(data, lang);
		},
		draw_KR_PRESS: function(data, lang) {
			try {
				drawActions.drawCommonList(data, lang, 'press');
				
			} catch(e) { console.error(e); }
		},
		draw_KR_PEOPLE: function(data, lang) {
			drawActions.drawCommonPeople(data, lang);
		},
		draw_KR_ISSUE : function(data, lang, id){
			drawActions.drawCommonList(data, lang, 'issue');
		},
		draw_KR_SCRAP : function(data, lang){
			drawActions.drawCommonList(data, lang, 'scrap');
		},
		draw_KR_PHOTO : function(data, lang){
			drawActions.drawCommonFrame(data, lang, 'photo');
		},
		draw_KR_MPIC : function(data, lang){
			drawActions.drawCommonMpic(data, lang,'mpic');
		},
		draw_KR_AUDIO : function(data, lang){
			drawActions.drawCommonList(data, lang, 'audio');
		},
		draw_KR_GRAPHIC : function(data, lang){
			drawActions.drawCommonFrame(data, lang,'graphic');
		},
		draw_KR_ACTIVE : function(data, lang){
			drawActions.drawCommonFrame(data, lang,'active');
		},
		draw_KP_TRANSCRIPT : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpTranscript');
		},
		draw_KP_ARTICLE : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpActicle');
		},
		draw_KP_DAILY_NOTE : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpDailyNote');
		},
		draw_KP_DAILY_ACT : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpDailyAct');
		},
		draw_KR_PEOPLE_70NK : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpPeople');
		},
		draw_KP_ANNUAL : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpAnnual');
		},
		draw_KP_VOCABULARY : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpVoca');
		},
		draw_KP_LAW : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpLaw');
		},
		draw_KP_AGREEMENT : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpAgree');
		},
		draw_KP_CONFERENCE : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpConference');
		},
		draw_KP_ORGANIZATION : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpOrganization');
		},
		draw_KP_ARTICLE : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpArticle');
		},
		draw_KP_TRANSCRIPT : function(data, lang){
			drawActions.drawCommonList(data, lang,'kpTranscript');
		},
		/*******************************************
		 * [기사 draw]
		 * !!!!! 전체 언어 사용 !!!!!
		 *  글 기사의 검색 데이터를 받아 draw를 한다.
		 * @param data : 검색 결과 데이터, lang : 언어 형식
		 * @return void
		 ********************************************/
		drawCommonArticle : function(data, lang){
			//console.debug(arguments);
			console.debug('in draw', $._cms_search.categoryItem.key.indexOf('All'));
			var rData = data['result'] || [];
			var length = rData.length;
			
			var tag = '';
			
//			$('<div></div>').addClass('list_Container list_Container40').appendTo( $(this) );
			
			if($._cms_search.categoryItem.key.indexOf('All') != -1 ){
				$('<div></div>',{'id':'searchline'}).addClass('search_line').appendTo($('#searchList'));
				for(var i = 0; i<4; i++){
					$('<div></div>').addClass('arti01')
					.append($('<div></div>').addClass('searchcon01')
							.append($('<input>',{'type':'checkbox','name':'articleChk','value':rData[i].CONTENTS_ID}).addClass('check01'), (lang=='kor' ? $('<img>',{'src':'/images/ico/yonhap_searchList_01-14.png','art':'1보'}) : ''))
								,($('<div></div>').addClass('artiTitle')
										.append($('<a></a>',{'href':'#'})
												.append($('<p></p>').addClass('txtTiltle').html(rData[i].TITLE))
										)
								)
								,($('<div></div>').addClass('artiLink_ico')
										.append($('<p></p>').addClass('link_P').text(rData[i].SEND_DATE + ' ' + rData[i].SEND_TIME)
												, $('<a></a>',{'href':'#'})
													.append((lang=='kor' ? $('<img>',{'src':'/images/ico/yonhap_searchList_01-13.png', }).addClass('i_conCont fr') : ''))
													)
												)
								,($('<div></div>').addClass('artiTxt')
										.append($('<p></p>').addClass('articletxt').html(rData[i].TEXT_BODY)))
					).appendTo('#searchline');
				}
				$('<div></div>').addClass('search_more').append($('<a></a>',{'href':'#'}).text('글기사 더보기')).appendTo('.search_line');
			}else{
				$.each(rData, function(i,item){
					$('<div></div>').addClass('arti01')
						.append($('<div></div>').addClass('searchcon01')
								.append($('<input>',{'type':'checkbox','name':'articleChk','value':item.CONTENTS_ID}).addClass('check01'), (lang=='kor' ? $('<img>',{'src':'/images/ico/yonhap_searchList_01-14.png','art':'1보'}) : ''))
									,($('<div></div>').addClass('artiTitle')
											.append($('<a></a>',{'href':'#'})
													.append($('<p></p>').addClass('txtTiltle').html(item.TITLE))
											)
									)
									,($('<div></div>').addClass('artiLink_ico')
											.append($('<p></p>').addClass('link_P').text(item.SEND_DATE + ' ' + item.SEND_TIME)
													, $('<a></a>',{'href':'#'})
														.append((lang=='kor' ? $('<img>',{'src':'/images/ico/yonhap_searchList_01-13.png', }).addClass('i_conCont fr') : ''))
														)
													)
									,($('<div></div>').addClass('artiTxt')
											.append($('<p></p>').addClass('articletxt').html(item.TEXT_BODY)))
					).appendTo('.list_Container');
				});
			}
	//		if (rData && Array.isArray( rData ) && rData.length == 0) {
			/*if ($('.arti01').length === 0) {
				$('<h1></h1>').text('검색결과가 없습니다').appendTo('.list_Container');
			}*/
	//		}else{
	//			$('<h1></h1>').text('검색결과가 없습니다').appendTo('.list_Container');
	//		}
		},
		/*******************************************
		 * [인물 draw]
		 * !!!!! 국문, 영어에서만 사용 !!!!!
		 *  인물 검색 데이터를 받아 draw를 한다.
		 *  
		 *  %%%% check %%%%% - 북한정보에서도 사용한다.
		 * @param data : 검색 결과 데이터, lang : 언어 형식
		 * @return void
		 * 
		 * @plus explanation
		 * 국문(북한포함), 영어 공통으로 나타날 항목들 :  이름, 생년월일, 직장(현직)
		 * 국문에만 나타날 항목들 : 전직, 인물구분, 기타
		 * 영문에만 나타날 항목들 : serial(?)
		 ********************************************/
		drawCommonPeople : function(data, lang){
			//console.debug('peopleList >>>>>' , data, lang);
			var rData = data.result;
			var length = rData.length;
			/*
			$('<div></div>').addClass('list_Container list_Container40')
				.append($('<div></div>').addClass('search_line people_search')
								.append($('<ul></ul>',{'id':'peopleList'})))
					.appendTo('#content_container');*/
			
			if(length > 0){
				if($._cms_search.categoryItem.key.indexOf('All') != -1){
					//$('<div></div>').addClass('search_line people_search').appendTo('#searchList');
					$('<div></div>',{'id':'peopleline'}).addClass('search_line people_search').appendTo($('#searchList'));
					for(var i = 0; i<2; i++){
						var career = rData[i].CAREER.indexOf(',') != -1 ? rData[i].CAREER.split(',') : '';
						
						$('<li></li>').addClass('arti01')
							.append($('<span></span>').addClass('peopleSearch_list')
									.append($('<table></table>').addClass('previewTable')
											.append($('<colgroup></colgroup>')
													.append(
															$('<col>').css('width','120px'),
															$('<col>').css('width','50px'),
															$('<col>').css('width','*'))
														, $('<tbody></tbody>')
															.append($('<tr></tr>')
																	.append(
																			$('<th></th>',{'rowspan':'6'}).addClass('pho')
																				.append($('<div></div>').addClass('previewImg')
																						.append(
																								$('<img>',{'src':'/images/etc/blank_people.png'}).addClass('pImg02'))),
																								lang == 'KR' ? $('<th></th>').text('이름') : $('<th></th>').text('Serial'),
																								lang == 'KR' ? $('<td></td>').html(rData[i].NAME) : $('<td></td>').append($('<input>',{'type':'checkbox'}),$('<span></span>').text(i)))
																								,
																								lang == 'KR' ? '' : $('<tr></tr>').append($('<th></th>').text('Name'),($('<td></td>').html(rData[i].NAME))),
																								$('<tr></tr>')
																									.append(
																											lang == 'KR' ? $('<th></th>').text('생년월일') : $('<th></th>').text('Birth'),
																											$('<td></td>').text(rData[i].BIRTH_DATE))
																								,
																								lang == 'KR' ? 
																									$('<tr></tr>')
																										.append(
																												$('<th></th>').text('전직'),
																												$('<td></td>').text('전직')
																													.append($('<span></span>',{'title':career}).addClass('c_blue search_dec').text(' '+career.length+'+'))) : ''					
																								,
																								lang == 'KR' ? 
																									$('<tr></tr>')
																										.append(
																												$('<th></th>').text('현직'),
																												$('<td></td>').html(rData[i].NOW_OFFICE))
																									:
																									$('<tr></tr>')
																										.append(
																												$('<th></th>').text('Office'),
																												$('<td></td>').html(rData[i].NOW_OFFICE))
																								,
																								lang == 'KR' ?
																									$('<tr></tr>')
																										.append($('<th></th>').text('인물구분'),
																												$('<td></td>').text(rData[i].PEOPLE_TYPE))
																									: ''
																								,
																								lang == 'KR' ?
																									$('<tr></tr>')
																										.append($('<th></th>').text('기타')
																												,$('<td></td>')
																													.append($('<a></a>',{'href':'#'}).addClass('c_blue').text('기타'),
																															$('<a></a>',{'href':'#'}).addClass('c_blue').text(' 다른사진 보기')))
																									: '' 
									)))).appendTo('#peopleline');
					}
				}else{
					$('<div></div>').addClass('search_line people_search')
						.append($('<ul></ul>').addClass('peopleResponse'))
							.appendTo($('#searchList'));
					$.each(rData, function(i,item){
						var career = item.CAREER.indexOf(',') != -1 ? item.CAREER.split(',') : '';
						
						$('<li></li>').addClass('arti01')
							.append($('<span></span>').addClass('peopleSearch_list')
									.append($('<table></table>').addClass('previewTable')
											.append($('<colgroup></colgroup>')
													.append(
															$('<col>').css('width','120px'),
															$('<col>').css('width','50px'),
															$('<col>').css('width','*'))
														, $('<tbody></tbody>')
															.append($('<tr></tr>')
																	.append(
																			$('<th></th>',{'rowspan':'6'}).addClass('pho')
																				.append($('<div></div>').addClass('previewImg')
																						.append(
																								$('<img>',{'src':'/images/etc/blank_people.png'}).addClass('pImg02'))),
																								lang == 'KR' ? $('<th></th>').text('이름') : $('<th></th>').text('Serial'),
																								lang == 'KR' ? $('<td></td>').html(item.NAME) : $('<td></td>').append($('<input>',{'type':'checkbox'}),$('<span></span>').text(i)))
																								,
																								lang == 'KR' ? '' : $('<tr></tr>').append($('<th></th>').text('Name'),($('<td></td>').html(item.NAME))),
																								$('<tr></tr>')
																									.append(
																											lang == 'KR' ? $('<th></th>').text('생년월일') : $('<th></th>').text('Birth'),
																											$('<td></td>').text(item.BIRTH_DATE))
																								,
																								lang == 'KR' ? 
																									$('<tr></tr>')
																										.append(
																												$('<th></th>').text('전직'),
																												$('<td></td>').text('전직')
																													.append($('<span></span>',{'title':career}).addClass('c_blue search_dec').text(' '+career.length+'+'))) : ''					
																								,
																								lang == 'KR' ? 
																									$('<tr></tr>')
																										.append(
																												$('<th></th>').text('현직'),
																												$('<td></td>').html(item.NOW_OFFICE))
																									:
																									$('<tr></tr>')
																										.append(
																												$('<th></th>').text('Office'),
																												$('<td></td>').html(item.NOW_OFFICE))
																								,
																								lang == 'KR' ?
																									$('<tr></tr>')
																										.append($('<th></th>').text('인물구분'),
																												$('<td></td>').text(item.PEOPLE_TYPE))
																									: ''
																								,
																								lang == 'KR' ?
																									$('<tr></tr>')
																										.append($('<th></th>').text('기타')
																												,$('<td></td>')
																													.append($('<a></a>',{'href':'#'}).addClass('c_blue').text('기타'),
																															$('<a></a>',{'href':'#'}).addClass('c_blue').text(' 다른사진 보기')))
																									: '' 
									)))).appendTo('.peopleResponse');
																
					});
				}
				
			}else{
				$('<div></div>').text('검색 결과가 없습니다');
			}
			
		},
		/*******************************************
		 * [리스트 draw]
		 * draw 공통 부분(언어는 국문만 해당)
		 * 대상 : 스크랩, 이슈, 오디오,
		 * 		 북한정보(북한일지, 북한인물동정, 북한연표, 북한용어, 북한법, 남북(국제)합의문, 남북회담대표팀명단, 북한관련 기관단체),
		 * 		 방송수신록, 조선중앙통신기사, 외신
		 * 
		 * check 1!
		 * >> 분기가 필요합니다. ( 번호, checkbox 고려 )
		 * 세가지로 나뉨(flag 값을 나타낸다)
		 * flag 1. 번호만 있는것 : 이슈
		 * flag 2. 체크박스만 있는 것 : 북한정보(북한일지, 북한인물동정, 북한연표, 북한용어, 북한법, 남북(국제)합의문, 남북회담대표팀명단, 북한관련 기관단체),
		 * flag 3. 둘 다 있는 것 : 조선중앙통신기사, 방송수신록, 외신, 오디오, 스크랩 
		 * 
		 * 
		 * check 2!
		 * >>'국문'의 오디오는 관련정보 아이콘이 표시되어야 한다.
		 * 검색 데이터를 받아 draw를 한다.
		 * @param data : 검색 결과 데이터, lang : 언어 형식
		 * @return void
		 * 
		 ********************************************/
		drawCommonList : function(data, lang, id){
			//console.log(data);
			var rData = data.result;
			var length = rData.length;
			
			//$('<div></div>').addClass('list_Container list_Container40').appendTo('#content_container');
			
			/************************************
			 * 검색 시 사이드메뉴가 어떤 것인지 판단해야함 - 선택된 사이드메뉴가 무엇인지 구해서, 분기를 나눠야 함
			 * >> 지금 'active'라는 클래스명을 가지고 있는 메뉴의 또다른 클래스명을 가지고 와야 한다..
			 ************************************/
			console.debug('###', $._cms_search);
			var selectedMenu = $('#search_side').find('div.active').attr('id');
			console.log(selectedMenu);
			var sideFlag = '';
			var numberText = '';
			
			if(selectedMenu == 'Issue' /*|| selectedMenu == 'Audio' || selectedMenu == 'Scrap' || selectedMenu == 'Foreign'*/){
				sideFlag = 1;
			}else if(selectedMenu == 'Dprk'){
				sideFlag = 2;
			}else{
				sideFlag = 3;
			}
			
			if(length > 0){
				if($._cms_search.categoryItem.key.indexOf('All') != -1 ){
					$('<div></div>',{'id': id}).addClass('search_line').appendTo('#searchList');
					for(var i = 0; i<4; i++){
						$('<div></div>').addClass('arti01')
						.append((sideFlag == 2 || sideFlag == 3 ? $('<div></div>').addClass('searchcon01').append($('<input>',{'type':'checkbox','name':'articleChk'}).addClass('check01')) :'')
								,
								$('<div></div>').addClass('artiTitle').append(
										$('<a></a>',{'onClick':'#'})
											.append(
													$('<span></span>').addClass('search_no').text(((sideFlag == 1 || sideFlag == 3) ? (i+'. ') : ''))
													, $('<p></p>').addClass('txtTiltle').html(sideFlag == 1 ? rData[i].ISSUE_NAME : rData[i].TITLE))
													, $('<div></div>').addClass('artiLink_ico')
															.append(
																	$('<p></p>').addClass('link_P').text('2018-08-21')),
																	((lang == 'KR' && selectedMenu == 'Audio') ? $('<a></a>',{'href':'#'})
																			.append($('<img>',{'src':'/images/ico/yonhap_searchList_01-13.png','art':'링크'}).addClass('i_conCont fr')):'')))
						.appendTo('#'+id);
					}
					$('<div></div>').addClass('search_more').append($('<a></a>',{'href':'#'}).text('리스트 더보기')).appendTo('.search_line');
				}else{
					$.each(rData, function(i, item){
						$('<div></div>').addClass('arti01')
						.append((sideFlag == 2 || sideFlag == 3 ? $('<div></div>').addClass('searchcon01').append($('<input>',{'type':'checkbox','name':'articleChk'}).addClass('check01')) :'')
								,
								$('<div></div>').addClass('artiTitle').append(
										$('<a></a>',{'onClick':'#'})
											.append(
													$('<span></span>').addClass('search_no').text(((sideFlag == 1 || sideFlag == 3) ? (i+'. ') : ''))
													, $('<p></p>').addClass('txtTiltle').html(sideFlag == 1 ? item.ISSUE_NAME : item.TITLE))
													, $('<div></div>').addClass('artiLink_ico')
															.append(
																	$('<p></p>').addClass('link_P').text('2018-08-21')),
																	((lang == 'KR' && selectedMenu == 'Audio') ? $('<a></a>',{'href':'#'})
																			.append($('<img>',{'src':'/images/ico/yonhap_searchList_01-13.png','art':'링크'}).addClass('i_conCont fr')):'')))
						.appendTo('.list_Container');
					});
				}
			}else{
				$('<h1></h1>').text('검색 결과가 없습니다').appendTo('.list_Container');
			}
		},
		/*******************************************
		 * [사진 draw]
		 * !!!!! 전체 언어 사용 !!!!!
		 *  사진의 검색 데이터를 받아 draw를 한다.
		 *  
		 *  -공통 함수-
		 *  대상 : 사진, 그래픽, 액티브뉴스
		 * @param data : 검색 결과 데이터, lang : 언어 형식
		 * @return void
		 ********************************************/
		drawCommonFrame : function(data, lang, id){
			items = data.result;
			/*
			$('<div></div>').addClass('list_Container list_Container40')
				.append($('<div></div>').addClass('tumbContainer wAuto tb0')
						.append($('<div></div>').addClass('picListLi')
								.append($('<ul></ul>').addClass('picUl picUl40')
										)))
					.appendTo('#content_container');
			*/
			$('<div></div>').addClass('search_line tumb_search relative').append($('<div></div>').addClass('tumbContainer wAuto tb0')
					.append($('<div></div>').addClass('picListLi')
							.append($('<ul></ul>',{'id':id}).addClass('picUl picUl40')
									)))
									.appendTo('#searchList');
			var times = '';
			console.debug('---------------------------', id, data);
			if(items.length > 0){
				if($._cms_search.categoryItem.key.indexOf('All') != -1 ){
					
					for(var i = 0; i<4; i++){
						if($._cms_search.categoryItem.key == 'Photo'){
							times = lang == 'KR' || lang == 'en' ? items[i].PHOTO_DATE+' '+items[i].PHOTO_TIME : items[i].DIST_DATE+' '+items[i].DIST_TIME;
						}else if($._cms_search.categoryItem.key=='Graphic'){
							times = items[i].REGIST_DATE+' '+items[i].REGIST_TIME;
						}else if($._cms_search.categoryItem.key == 'Active'){
							times = items[i].SEND_DATE + ' ' + items[i].SEND_TIME;
						}
						$('<li></li>').addClass('picLi')
							.append(
									  $('<div></div>').addClass('thumbPic').append($('<img>',{'src':'/images/etc/blank_photo.png'}).addClass('thumbnail'))
									, $('<div></div>').addClass('fileName')
										.append($('<span></span>')
												.append(lang == 'KR' ? ($('<a></a>',{'href':'#'})
														.append($('<img>',{'src':'/images/ico/yonhap_searchList_01-13.png'}).addClass('i_conCont')
																)):''))
									, $('<a></a>',{'href':'#'})
										.append($('<div></div>').addClass('mt3').html((lang == 'KR' ? (type=='Photo' ? '<strong>촬영</strong> ' : '') : '') + times))
									, $('<a></a>',{'href':'#'})
										.append((lang=='KR' ? $('<div></div>').addClass('thumid thumid40').text(items[i].CONTENTS_ID) : $('<div></div>').addClass('thumid thumid40').text(items[i].CONTENTS_ID)))
									, $('<div></div>').addClass('thumTitle')
										.append($('<span></span>').html(items[i].TITLE)) 
							)
						.appendTo('#'+id);
					}
				}else{
					$.each(items, function(i, item){
						
						if($._cms_search.categoryItem.key == 'Photo'){
							times = lang == 'KR' || lang == 'en' ? item.PHOTO_DATE+' '+item.PHOTO_TIME : item.DIST_DATE+' '+item.DIST_TIME;
						}else if($._cms_search.categoryItem.key=='Graphic'){
							times = item.REGIST_DATE+' '+item.REGIST_TIME;
						}else if($._cms_search.categoryItem.key == 'Active'){
							times = item.SEND_DATE + ' ' + item.SEND_TIME;
						}
						$('<li></li>').addClass('picLi')
							.append(
									  $('<div></div>').addClass('thumbPic').append($('<img>',{'src':'/images/etc/blank_photo.png'}).addClass('thumbnail'))
									, $('<div></div>').addClass('fileName')
										.append($('<span></span>')
												.append(lang == 'KR' ? ($('<a></a>',{'href':'#'})
														.append($('<img>',{'src':'/images/ico/yonhap_searchList_01-13.png'}).addClass('i_conCont')
																)):''))
									, $('<a></a>',{'href':'#'})
										.append($('<div></div>').addClass('mt3').html((lang == 'KR' ? (type=='Photo' ? '<strong>촬영</strong> ' : '') : '') + times))
									, $('<a></a>',{'href':'#'})
										.append((lang=='KR' ? $('<div></div>').addClass('thumid thumid40').text(item.CONTENTS_ID) : $('<div></div>').addClass('thumid thumid40').text(item.CONTENTS_ID)))
									, $('<div></div>').addClass('thumTitle')
										.append($('<span></span>').html(item.TITLE)) 
							)
						.appendTo('.picUl');
					});
				}
			}
		},
		/*******************************************
		 * [영상 draw]
		 * !!!!! 전체 언어 사용 !!!!!
		 *  영상의 검색 데이터를 받아 draw를 한다.
		 * @param data : 검색 결과 데이터, lang : 언어 형식
		 * @return void
		 ********************************************/
		drawCommonMpic : function(data, lang){
			
			var rData = data.result;
			
			$('<div></div>').addClass('list_Container list_Container40')
			.append($('<div></div>').addClass('tumbContainer wAuto tb0')
					.append($('<div></div>').addClass('videoListLi_02')
							.append($('<ul></ul>').addClass('vodUI')
									)))
				.appendTo('#content_container');
			
			$.each(rData, function(i, item){
				
				var times = item.REGIST_DATE + ' ' + item.REGIST_TIME;
				
				$('<li></li>').addClass('vodLi')
					.append($('<div></div>').addClass('vodthumb')
							.append($('<img>',{'src':'/images/etc/blank_video.png'}).addClass('vod_thumbnail'))
							, $('<div></div>').addClass('vodPreview40')
							, $('<a></a>',{'href':'#'})
								.append($('<div></div>').addClass('mt3').text(times))
							, $('<a></a>',{'href':'#'})
								.append($('<div></div>').addClass('thumid thumid40 mt3').text(item.CONTENTS_ID))
							, $('<div></div>').addClass('vod_thumTitle').html(item.TITLE)
					).appendTo('.vodUI');
			});
		}
	};
	
	/**********************************
	 **********************************
	 * 인기 키워드 관련
	 **********************************
	 **********************************/
	
	$('#keyword')
		.bind('init', function(){
			// 키워드 호출을 위한 데이터 세팅
			$(this).data('data', $.extend({
				  lang_type : $._cms_search.lang || 'kr'
			},window.keywordSetting));
		})
		.bind('search', function(e, _option){
			var self = this;
//			console.debug('option value --- ', _option);
			$.each(_option, function(i) {
				if(i >= 0){
					var _data = this;// whit is 'this'???
					
					$(self).triggerHandler('load', _data).then(function(response, textStatus, jqXHR){
						var item = {};
						
						if (typeof response === 'string' && response.startsWith('{') && response.endsWith('}')) {
							item = response;
						}
						if (typeof response === 'object' && Object.values(response)[0]) {
							item = response;
						}
						//console.debug('what??', _data, item);
						$(self).triggerHandler('draw', {data: _data, item: item});
					});
				}
			});
			// 여기가 엎어치게 된다.(순서를 보장해주지 않아 데이터가 덮어치게 된다..);
//			$(this).data('data', $.extend($(this).data('data'), _option));
			
			/*$(self).triggerHandler('load', _option).then(function(response, textStatus, jqXHR){
				console.debug(this, response, textStatus, jqXHR)
				var item = {};
				
				if (typeof response === 'string' && response.startsWith('{') && response.endsWith('}')) {
					item = response;
				}
				if (typeof response === 'object' && Object.values(response)[0]) {
					item = response;
				}
				$(self).triggerHandler('draw', {item: item, data: _option});
			});*/
//			$(this).data('data', $.extend($(this).data('data'), _option));
			
		})
		.bind('draw', function(e, items){
			var self = this;
			var item = items.item;
			var data = items.data;
			//console.log(items);
			
//			if(data.rtype == 'hot_kwd'){
//				alert("hi");
//			}else{
//				drawKeyword(self, item);
//			}
//			console.debug('data check----->>', $(self).data('data'));
//			console.debug('.....', item);
//			if($(self).data('data').rtype == 'hot_kwd'){
			if(data.rtype == 'hot_kwd'){
				drawRiseKeyword(self,item);
			}else{
				drawKeyword(self, item, data);
			}
			
		})
		.bind('load', function(e, _data){
			//console.log(_data);
			////console.debug('keyword data >>>', $(this).data('data'));
			return $.ajax({
				  url : '/cms/search/keyword.do'
				, type : "POST"
				, data : _data
			});
		});
	
	
	var drawKeyword = function(self, items, data){
//		console.log($(self).find('div.popKey01:eq(1)'));
		var keyData = $(self).data('data');
//		console.log(keyData);
		var list = items.result;
		var flag = '';
		var text = '';
		if(data.rtype == 'pop_kwd'){
			flag = $(self).find('div.popKey01:eq(0) > a');
			flag.empty();
		}else{
			flag = $(self).find('div.popKey01:eq(1) > a');
			flag.empty();
		}
		
		if(list.length != undefined){
			for(var i = 0; i<list.length; i++){
				//console.debug('checkdk value =>>', list[i]);
				$('<p></p>').addClass('pTxt01').text(list[i].keyword).on('click',function(e){
					$('#schString').val();
					$('#schString').val($(e.target).text());
					var extendData = {
							  'srch_area'			: $._cms_search.categoryItem.key.toLowerCase()
							, 'query'				: $(this).text()
							, 'channel'				: 'cms_'+$._cms_search.lang
							, 'contents_attribute'	: $._cms_search.categoryItem.attr
							, 'people_type'			: $._cms_search.lang.toLocaleUpperCase() != 'KR' ? '70EN' : 'KR'
							, 'contents_type'		: 'KR'
							, 'lang_type'			: $._cms_search.lang.toLocaleUpperCase()
						};
					
					$('#content_container').empty().removeClass('content_container40 result_con40').addClass('result_con');
					$('#content_container').append($('<div></div>',{'id':'searchList'}).addClass('list_Container list_Container40'));
					
					$('#content_container').triggerHandler('search',$.extend(window.formData, extendData));
					
					$('#keyword').triggerHandler('search', 
							[[
								$.extend({},window.keywordSetting,
									{ 
									  'line'		: '5',
									  'keyword'		: $("#schString").val(),
									  'rtype'		: 'rel_kwd',
									  'srch_area'	: $._cms_search.categoryItem.key == 'People' ? '' : /*$._cms_search.categoryItem.key.toLowerCase()*/'',
									  'channel'		: 'cms_'+ ($._cms_search.categoryItem.key == 'Foreign' ? 'en' : $._cms_search.lang)
									 }
								)
							]]/*$.extend(window.formData, extendData)*/
						);
					
				})
				.appendTo(flag);
			}
		}
	};
	
	var drawRiseKeyword = function(self, items){
		$('#realTimeKwd').empty();
		var item = items.result;
		
		$.each(item, function(i){
			
			if( i == 0 ){
				var updownFlag = this.rankingGap > 0 ? ' ico_up' : this.rankingGap == 0 ? '' : ' ico_down';
				var updownNum = this.rankingGap == 0 ? '-' : this.rankingGap;
				var topInner = "<div class='hot_issue_view'><div class='Rcount'>";
				$('#realTimeKwd').append(topInner);
				$('<span></span>').addClass('listNum').text(this.ranking)
					.appendTo($('.Rcount'));
				$('<span></span>').addClass('rankPeople')
					.append($('<a href="#"></a>').text(this.keyword).on('click', keywordClick))
					.appendTo($('.Rcount'));
				var innerRank = '<em class="rankNum fr"><span class="ranktxt'+ updownFlag +'"></span>' + updownNum + '</em>';
				$('.Rcount').append(innerRank);
				
				var bottomInner = '<div class="hot_issueBox" style="display:none"><div class="hot_issue"><ol class="hotissue_list"></ol></div></div>';
				$('#realTimeKwd').append(bottomInner);
			}else{
				var updownFlag = this.rankingGap > 0 ? ' ico_up' : this.rankingGap == 0 ? '' : ' ico_down';
				var updownNum = this.rankingGap == 0 ? '-' : this.rankingGap;
				$('<li></li>')
					.append($('<div></div>').addClass('roll_txt')
							.append($('<div></div>').addClass('Rcount key'+i))
					)
					.appendTo($('.hotissue_list'));
				
				//$('<span></span>').addClass('listNum').text(this.ranking).appendTo('.Rcount'+i);
				var inner = '<span class="listNum">'+this.ranking+'</span><span class="rankPeople rkey'+i+'"></span><em class="rankNum">'
					+ '<span class="ranktxt'+ updownFlag + '"></span>' + updownNum +'</em>';
				$('.key'+i).append(inner);
				$('<a href="#"></a>').text(this.keyword).on('click', keywordClick)
				.appendTo($('.rkey'+i));
			}
		});
		
		$('#realTimeKwd').hover(function(){
			$('.hot_issueBox').css('display','block');
		},function(){
			$('.hot_issueBox').css('display','none');
		});
	};
	
	/*********************************
	 * 실시간 인기키워드 클릭 이벤트 함수
	 *********************************/
	var keywordClick = function(e){
		$('#schString').val('');
		$('#schString').val($(e.target).text());
		var trigger = 'draw' + $('#search_side').find('div.active').attr('id');
//		$('#content_container').triggerHandler('draw');
//		$('#content_container').triggerHandler(trigger);
		
//		$('form:first').serializeArray()[0] //  form data
		// FIXME form data
		
		var extendData = {
			  'coll'				: []
			, 'query'				: $(e.target).text()
			, 'contents_attribute'	: $._cms_search.categoryItem.attr
			, 'people_type'			: $._cms_search.lang.toLocaleUpperCase() != 'KR' ? '70EN' : 'KR'
			, 'contents_type'		: 'KR'
			, 'lang_type'			: $._cms_search.lang.toLocaleUpperCase()
		};
		
		$('#content_container').empty().removeClass('content_container40 result_con40').addClass('result_con');
		$('#content_container').append($('<div></div>',{'id':'searchList'}).addClass('list_Container list_Container40'));
		//console.log($('form:first').serializeArray());
		$('#content_container').triggerHandler('search', $.extend(window.formData,extendData));
		
		$('#keyword').triggerHandler('search', 
			[	
				[
					$.extend({},window.keywordSetting,
						{ 
						  'keyword'		: $(e.target).text(),
						  'rtype'		: 'rel_kwd',
						  'srch_area'	: $._cms_search.categoryItem.key.toLowerCase(),
						  'channel'		: 'cms_'+ ($._cms_search.categoryItem.key == 'Foreign' ? 'en' : $._cms_search.lang)
						 }
					)
				]
			]/*$.extend(window.formData, extendData)*/);
	};
});
