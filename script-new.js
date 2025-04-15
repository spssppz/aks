document.addEventListener('DOMContentLoaded', function () {
	if (document.querySelector('.product-main__slider')) {
		// Инициализация основного слайдера
		const mainSlider = new Swiper('.product-main__slider', {
			loop: true,
			allowTouchMove: false, // отключаем свайп

			navigation: {
				nextEl: '.product-main__btn_next',
				prevEl: '.product-main__btn_prev',
			},
		});

		// Инициализация слайдера превью
		const thumbsSlider = new Swiper('.product-thumbs__slider', {
			loop: true,
			slidesPerView: 3,
			spaceBetween: 10,
			// centeredSlides: true,
			slideToClickedSlide: true,
			navigation: {
				nextEl: '.product-thumbs__btn_next',
				prevEl: '.product-thumbs__btn_prev',
			},
		});

		// Связываем слайдеры
		mainSlider.controller.control = thumbsSlider;
		thumbsSlider.controller.control = mainSlider;
	}

	if (document.querySelector('.spoiler__header')) {
		const spoilerHeaders = document.querySelectorAll('.spoiler__header');

		// Функция для переключения спойлера
		function toggleSpoiler(spoiler) {
			spoiler.classList.toggle('active');
		}

		// Обработчики событий для заголовков спойлеров
		spoilerHeaders.forEach(header => {
			header.addEventListener('click', function () {
				const spoiler = this.closest('.spoiler');
				toggleSpoiler(spoiler);
			});
		});

	}

});
const uniqArray = array => {
	return array.filter((item, index, self) => {
		return self.indexOf(item) === index
	})
}

function dataMediaQueries(array, dataSetValue) {
	const media = Array.from(array).filter(item => item.dataset[dataSetValue])
	if (media.length) {
		const breakpointsArray = []
		media.forEach(item => {
			const params = item.dataset[dataSetValue]
			const breakpoint = {}
			const paramsArray = params.split(",")
			breakpoint.value = paramsArray[0]
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max"
			breakpoint.item = item
			breakpointsArray.push(breakpoint)
		})

		let mdQueries = breakpointsArray.map(item =>
			'(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type
		)
		mdQueries = uniqArray(mdQueries)
		const mdQueriesArray = []

		if (mdQueries.length) {
			mdQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",")
				const mediaBreakpoint = paramsArray[1]
				const mediaType = paramsArray[2]
				const matchMedia = window.matchMedia(paramsArray[0])
				const itemsArray = breakpointsArray.filter(item =>
					item.value === mediaBreakpoint && item.type === mediaType
				)
				mdQueriesArray.push({
					itemsArray,
					matchMedia
				})
			})
			return mdQueriesArray
		}
	}
}

const tabs = () => {
	const tabs = document.querySelectorAll('[data-tabs]')

	if (tabs.length) {
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add('_tab-init')
			tabsBlock.setAttribute('data-tabs-index', index)
			tabsBlock.addEventListener("click", setTabsAction)
			initTabs(tabsBlock)
		})
		let mdQueriesArray = dataMediaQueries(tabs, "tabs")
		if (mdQueriesArray?.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				mdQueriesItem.matchMedia.addEventListener("change", () =>
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia))
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
			})
		}
	}

	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach(tabsMediaItem => {
			tabsMediaItem = tabsMediaItem.item
			let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]')
			let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]')
			let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]')
			let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]')
			tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem)
			tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem)
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index])
					tabsContent.append(tabsContentItem)
					tabsMediaItem.classList.add('_tab-spoller')
				} else {
					tabsTitles.append(tabsTitleItems[index])
					tabsMediaItem.classList.remove('_tab-spoller')
				}
			})
		})
	}

	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*')
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*')

		if (tabsContent.length) {
			tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock)
			tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock)
			tabsContent.forEach((tabsContentItem, index) => {
				tabsTitles[index].setAttribute('data-tabs-title', '')
				tabsContentItem.setAttribute('data-tabs-item', '')
				tabsTitles[index].classList.toggle('_tab-active', index === 0)
				tabsContentItem.hidden = index !== 0
			})
		}
	}

	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]')
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]')
		const tabsBlockAnimate = tabsBlock.hasAttribute('data-tabs-animate') ?
			(Number(tabsBlock.dataset.tabsAnimate) || 500) : 0

		if (tabsContent.length > 0) {
			tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock)
			tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock)
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains('_tab-active')) {
					if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate)
					else tabsContentItem.style.display = 'block'
				} else {
					if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate)
					else tabsContentItem.style.display = 'none'
				}
			})
		}
	}

	function setTabsAction(e) {
		const el = e.target
		if (el.closest('[data-tabs-title]')) {
			const tabTitle = el.closest('[data-tabs-title]')
			const tabsBlock = tabTitle.closest('[data-tabs]')
			const isSpollerMode = tabsBlock.classList.contains('_tab-spoller')
			const isActive = tabTitle.classList.contains('_tab-active')

			if (!tabsBlock.querySelector('._slide')) {
				if (isSpollerMode && isActive) {
					tabTitle.classList.remove('_tab-active')
					setTabsStatus(tabsBlock)
				} else {
					let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active')
					tabActiveTitle = Array.from(tabActiveTitle).filter(item =>
						item.closest('[data-tabs]') === tabsBlock)
					if (tabActiveTitle.length) tabActiveTitle[0].classList.remove('_tab-active')
					tabTitle.classList.add('_tab-active')
					setTabsStatus(tabsBlock)
				}
			}
			e.preventDefault()
		}
	}
}

tabs()
