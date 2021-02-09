$(document).ready(function() {
    // 拉取文章数据，优先拉取 GitHub 上的文章数据，拉取失败时（比如被墙了），再走降级方案
    fetch('https://raw.githubusercontent.com/baidu/san-website/master/source/article.json')
      .then(res => res.json())
      .then(res => setArticle(res))
      .catch(() => {
        fetch('article.json')
          .then(res => res.json())
          .then(res => setArticle(res));
      });

    function setArticle(response) {
      if (response && response.length) {
        document.querySelector('.article-container').classList.remove('hidden');
        const frag = document.createDocumentFragment();
        response.forEach(article => {
          const a = document.createElement('a');
          a.textContent = article.title;
          a.href = article.link;
          a.target = '_blank';
          frag.appendChild(a);
        });
        const bar = document.querySelector('.article-bar')
        bar.appendChild(frag);
        let isForward = true;   // 文章滚动条的滚动方向
        const scrollLeftMax = bar.scrollWidth - bar.clientWidth;
        setTimeout(() => {
          setInterval(() => {
            if (isForward) {
              if (++bar.scrollLeft >= scrollLeftMax) {
                isForward = false;
              }
            } else {
              if (--bar.scrollLeft <= 0) {
                isForward = true;
              }
            }
          }, 50);
        }, 1000);
      }
    }

		//SmothScroll
		$('a[href*=#]').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
			&& location.hostname == this.hostname) {
					var $target = $(this.hash);
					$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
					if ($target.length) {
							var targetOffset = $target.offset().top;
							$('html,body').animate({scrollTop: targetOffset}, 600);
							return false;
					}
			}
		});
		
		//scroll change nav color 
		// window.onscroll = function () {
  //           let scroll = document.body.scrollTop || document.documentElement.scrollTop;
  //           let nava1 = document.getElementsByClassName('nav-a1')[0];
            
  //           if (scroll >= 60 && scroll < 120) {
  //               if (!(/navscroll/.test(nava1.className))) {
  //                   nava1.className += ' navscroll';
  //                   debugger;
  //               }
  //           }
           
  //           else {
  //               nava1.className = 'nav-a1';
  //           }
  //       };


        //bodymovin control
        var resourceCards = document.querySelectorAll('.resource-block');
        var facilityCards = document.querySelectorAll('.facility-block');
        var len = resourceCards.length;
        setBodymovin = function(cards, len){
            while (len--) {
                var bodymovinLayer = cards[len].getElementsByClassName('bodymovin')[0];

                var animData = {
                    wrapper: bodymovinLayer,
                    loop: false,
                    prerender: true,
                    autoplay: false,
                    path: bodymovinLayer.getAttribute('data-movpath')
                };

                anim = bodymovin.loadAnimation(animData);

                (function(anim){
                   var card = cards[len];
                    $(card).on('mouseenter', function(){
                      anim.play();
                    });

                    $(card).on('mouseleave', function(e){
                      anim.stop();
                    });
                    
                })(anim);
            }
        }
        setBodymovin(resourceCards, len);
        setBodymovin(facilityCards, len);

});

