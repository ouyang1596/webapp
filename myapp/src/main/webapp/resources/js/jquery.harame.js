/*
 * jQuery harame ui 1.0
 * 
 */
(function($) {
	
	var KEY_CODE = {
			ESC: 27
	};
	
	var harameTools = {
			isValidEmail: function(email) {
				var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
				return reg.test(email);
			},
			isInvalidEmail: function(email) {
				return !harameTools.isValidEmail(email);
			},
			humanReadableByteCount: function(size) {
				if (size < 1024) {
					return size + "bytes";
				} else if (size < 1024 * 1024) {
					return parseFloat(size / 1024).toFixed(2) + "KB";
				} else if (size < 1024 * 1024 * 1024) {
					return parseFloat(size / (1024 * 1024)).toFixed(2) + "MB";
				} else if (size < 1024 * 1024 * 1024 * 1024) {
					return parseFloat(size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
				} else if (size < 1024 * 1024 * 1024 * 1024 * 1024) {
					return parseFloat(size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + "TB";
				} else if (size < 1024 * 1024 * 1024 * 1024 * 1024 * 1024) {
					return parseFloat(size / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2) + "PB";
				} else {
					return parseFloat(size / (1024 * 1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2) + "EB";
				}
			}
	};
	
	$.extend({
		harameTools: harameTools
	});
	
	var harame = function(name, plugin) {
		var obj = {};
		obj[name] = function() {
			var method = arguments[0];
			if (plugin[method]) {
				if (method.charAt(0) === "_") {
					$.error("No such method '" + method + "' for " + name + " instance");
					return this;
				}
				arguments = Array.prototype.slice.call(arguments, 1);
			} else if (typeof method === "object" || !method) {
				method = "_init";
			} else {
				$.error("Method" + method + "does not exist on jQuery.harame.ui");
				return this;
			}
			var options = $.extend({}, plugin.options, arguments[0] || {});
			return this.each(function() {
				var $this = $(this);
				var previous = $this.data(name);
				if (previous) {
					return previous[method].apply(previous);
				}
				var clonedPlugin = $.extend({}, plugin);
				clonedPlugin.options = options;
				clonedPlugin.$ = $this;
				$this.data(name, clonedPlugin);
				return clonedPlugin[method].apply(clonedPlugin);
			});
		};
		$.fn.extend(obj);
	}
	
	/**
	 * Ajax form
	 */
	var ajaxForm = harame("harameAjaxForm", {
		options: {
			resetSelector: "",
			submitSelector: "",
			submitUrl: ""
		},
		_init: function() {
			var that = this;
			this.initDOM();
			if (this.options.resetSelector) {
				this.$.find(this.options.resetSelector).click(function() {
					that._inputs.each(function() {
						var $this = $(this);
						var previousValue = $this.data("haramePreviousValue");
						if (previousValue) {
							$this.val(previousValue);
						} else {
							$this.val("");
						}
					});
					that._selects.each(function() {
						var $this = $(this);
						var previousValue = $this.data("haramePreviousValue");
						if (previousValue) {
							$this.val(previousValue);
						} else {
							$this.val("");
						}
					});
				});
			}
			if (this.options.submitSelector) {
				this.$.find(this.options.submitSelector).click(function() {
					var json = {};
					that._inputs.each(function() {
						var $this = $(this);
						json['"' + $this.attr("name") + '"'] = $this.val();
					});
					that._selects.each(function() {
						var $this = $(this);
						var previousValue = $this.data("haramePreviousValue");
						if (previousValue) {
							$this.val(previousValue);
						}
					});
					$.post(submitUrl,
							{
								
							});
				});
			}
		},
		initDOM: function() {
			this._inputs = this.$.find("input, textarea").each(function() {
				var $this = $(this);
				$this.data("haramePreviousValue", $this.val());
			});
			this._selects = this.$.find("select").each(function() {
				var $this = $(this);
				$this.data("haramePreviousValue", $this.val());
			});
		}
	});
	
	/*
	 * 
	 * Dialog
	 * 
	 */
	var dialog = harame("harameDialog", {
			options: {
				overlay: true,
				closedOnClickOverlay: false,
				autoOpen: false,
				fitResize: true,
				closedSelector: ""
			},
			_init: function() {
				var that = this;
				this._isOpen = false;
				this.$.hide();
				this.$.addClass("harame-dialog");
				/*
				 * Create a overlay
				 */
				if (this.options.overlay) {
					this.overlay = $("<div>")
						.addClass("harame-dialog-overlay")
						.appendTo($("body"))
						.hide();
					if (this.options.closedOnClickOverlay) {
						this.overlay.click(function() {
								that.close();
							});
					}
				}
				/*
				 * Auto open the dialog
				 */
				if (this.options.autoOpen) {
					this.open();
				} else {
					this.close();
				}
				/*
				 * Bind click event to closed class
				 */
				if (this.options.closedSelector) {
					this.$.find(this.options.closedSelector).click(function() {
						that.close();
					});
				}
				this.position();
				$(window).resize(function() {
					that.position();
				});
				// Attach event
				this._attachEvent();
			},
			_attachEvent: function() {
				var that = this;
				$(document).keyup(function(event) {
					switch (event.keyCode) {
						case KEY_CODE.ESC:
							that.close();
							break;
					}
				});
			},
			isOpen: function() {
				return this._isOpen;
			},
			open: function() {
				if (this._isOpen) {
					return;
				}
				this.position();
				if (this.options.overlay) {
					this.overlay.show();
				}
				this.$.show();
				this._isOpen = true;
			},
			close: function() {
				if (!this._isOpen) {
					return;
				}
				this._isOpen = false;
				this.$.hide();
				if (this.options.overlay) {
					this.overlay.hide();
				}
			},
			position: function() {
				var $window = $(window);
				var $document = $(document);
				this.$.css("top", ($window.height() - this.$.height()) / 2);
				this.$.css("left", ($window.width() - this.$.width()) / 2);
			}
	});
	
	/*
	 * 
	 * File upload
	 * 
	 */
	var fileUpload = harame("harameFileUpload", {
		options: {
			url: "",
			inputName: "file",
			formData: {},
			loadingMessage: "加载中。。。",
			prepare: function(fileName) {},
			success: function(data) {},
			error: function(data) {},
			complete: function(data) {}
		},
		_init: function() {
			this._stupidIE = !$.support.leadingWhitespace;
			this._supportFormData = !!window.FormData;
			if (!this._supportFormData) {
				this._createUploadIframe();
			}
			this._createLoading();
			this._createUploadForm();
		},
		_createLoading: function () {
			this._loading_message = $("<div>")
				.addClass("harame-file-upload_loading-message")
				.html(this.options.loadingMessage);
			this._loading = $("<div>")
				.addClass("harame-file-upload-loading")
				.append(this._loading_message)
				.hide()
				.appendTo($("body"));
		}, 
		_createUploadIframe: function() {
			this._iframe = $("<iframe>")
				.attr("name", new Date().getTime())
				.attr("src", "#")
				.addClass("harame-file-upload-iframe")
				.appendTo($("body"));
		},
		_createUploadForm: function() {
			var that = this;
			this._form = $("<form>")
				.attr("action", this.options.url)
				.attr("method", "POST")
				.attr("enctype", "multipart/form-data")
				.addClass("harame-file-upload-form")
				.appendTo($("body"));
			if (!this._supportFormData) {
				this._form.attr("target", this._iframe.attr("name"));
			}
			this._input = $("<input type='file' name='" + this.options.inputName + "' id='" + new Date().getTime() + "'>")
				.change(function() {
					that._loading.show();
					that._form.find("input:not([name=" + that.options.inputName + "])").remove();
					for (var key in that.options.formData) {
						that._form.append("<input type='hidden' name='" + key + "' value='" + that.options.formData[key] + "'>");
					}
					that.options.prepare(that._input.val());
					if (that._supportFormData) {
						var formData = new FormData(that._form[0]);
						$.ajax({
							url: that.options.url,
							type: "POST",
							data: formData,
							contentType: false,
							processData: false,
							success: function (data) {
								that._loading.hide();
								that.options.success(data);
							},
							error: function (data) {
								that._loading.hide();
								that.options.error(data);
							},
							complete: function (data) {
								that._loading.hide();
								that.options.complete(data);
							}
						});
					} else {
						that._form.submit();
						that._iframe.load(function() {
							$(this).unbind("load");
							that._complete();
						});
					}
					that._input.val("");
				})
				.appendTo(this._form);
			if (this._stupidIE) {
				this._label = $("<label for='" + this._input.attr("id") + "'></label>");
				this.$.after(this._label);
				this._label.append(this.$);
			} else {
				this.$.click(function() {
					that._input.trigger("click");
				});
			}
		},
		_complete: function() {
			var response;
			if (this._iframe[0].contentWindow) {
				response = this._iframe[0].contentWindow.document.body.innerHTML;
			} else if (this._iframe[0].contentDocument) {
				response = this._iframe[0].contentDocument.document.body.innerHTML;
			}
			var reg = /<pre.+?>(.+)<\/pre>/ig;
			if (reg.test(response)) {
				response = response.substring(response.indexOf(">") + 1);
				response = response.substring(0, response.length - 6);
			}
			this._loading.hide();
			this.options.success(response);
			this.options.complete(response);
		}
	});
	
	/*
	 * 
	 * Place holder
	 * 
	 */
	var placeHolder = harame("haramePlaceHolder", {
		options: {
			text: ""
		},
		_init: function() {
			this._nativeSupport = "placeholder" in document.createElement("input");
			if (this._nativeSupport) {
				if (this.options.text) {
					this.$.attr("placeholder", this.options.text);
				}
				return;
			} else {
				this._createLayer();
			}
		},
		_createLayer: function() {
			var that = this;
			var position = this.$.position();
			position.left += 2;
			this._label = $("<div>" + (this.options.text || this.$.attr("placeholder")) + "</div>")
				.css({
					"position": "absolute",
					"color": "#808080",
					"font-size": this.$.css("font-size"),
					"font-family": this.$.css("font-family"),
					"margin-top": this.$.css("margin-top"),
					"margin-left": this.$.css("margin-left"),
					"padding-top": this.$.css("padding-top"),
					"padding-left": this.$.css("padding-left"),
					"width": this.$.width() - 2,
					"height": this.$.height(),
					"overflow": "hidden",
					"word-wrap": "break-word"
				})
				.css(position)
				.click(function() {
					that.$.focus();
				});
			this.$.parent().append(this._label);
			this.$.focus(function() {
				that._label.hide();
			}).blur(function() {
				if (that.$.val().length > 0) {
					that._label.hide();
				} else {
					that._label.show();
				}
			});
		}
	});
	
	/*
	 * 
	 * Tooltip
	 * 
	 */
	var tooltip = harame("harameTooltip", {
		options: {
			selector: "",
			track: false,
			text: ""
		},
		_init: function() {
			var that = this;
			if (this.options.selector) {
				this._tooltip = $(this.options.selector).hide();
			}
			if (!this._tooltip) {
				this._tooltip = $("<div>" + this.options.text + "</div>")
					.addClass("harame-tooltip")
					.hide()
					.appendTo($("body"));
			}
			this._tooltip.css({
				"position": "absolute"
			});
			this.$.mouseenter(function() {
				that._show();
			})
			.mouseleave(function() {
				that._hide();
			});
			if (this.options.track) {
				this.$.mousemove(function(event) {
					that._show(event);
				});
			}
		},
		_show: function(event) {
			this._position(event);
			this._tooltip.show();
		},
		_hide: function() {
			this._tooltip.hide();
		},
		_position: function(event) {
			var position = this.$.position();
			if (this.options.track && event) {
				position.left = event.pageX + 10;
				position.top = event.pageY + 10;
			} else {
				position.top += this.$.height() + 10;
			}
			this._tooltip.css(position);
		}
	});
	
	/*
	 * 
	 * Slider
	 * 
	 */
	var slider = harame("harameSlider", {
		options: {
			width: 100,
			height: 100,
			previousClass: "",
			nextClass: "",
			paginationClass: "",
			pageClass: "",
			pageSelectedClass: "",
			images: [],
			interval: 3000
		},
		_init: function() {
			var that = this;
			this.$.css({
				width: this.options.width,
				height: this.options.height
			});
			this._createElements();
			setInterval(function() {
				that._slide();
			}, this.options.interval);
		},
		_createElements: function() {
			var that = this;
			var offset = this.$.offset();
			
			// Create image container element
			this._imageContainer = $("<div class='harame-slider-image-container'></div>")
				.css({
					"width": this.$.width(),
					"height": this.$.height(),
					"top": offset.top + this.$.outerHeight() - this.$.height(),
					"left": offset.left + this.$.outerWidth() - this.$.width()
				})
				.appendTo(this.$);
			
			// Create images
			if (this.options.images) {
				var anchor;
				for (var i in this.options.images) {
					var image = this.options.images[i];
					anchor = $("<a href='" + image.link + "' target='_blank'></a>")
						.appendTo(this._imageContainer);
					$("<img>")
						.attr("src", image.url)
						.css({
							"width": this._imageContainer.width(),
							"height": this._imageContainer.height(),
						})
						.appendTo(anchor);
					if (i > 0) {
						anchor.hide();
					}
				}
			}
			
			// Create previous element
			this._previous = $("<div class='harame-slider-previous'></div>")
				.click(function() {
					that._slide(-1, true);
				})
				.appendTo(this.$);
			if (this.options.previousClass) {
				this._previous.addClass(this.options.previousClass);
			}
			this._previous.css({
				"top": offset.top + this.$.outerHeight() - this.$.height() + (this.$.height() - this._previous.height()) / 2
			});
			
			// Create next element
			this._next = $("<div class='harame-slider-next'></div>")
			.click(function() {
				that._slide();
			})
				.appendTo(this.$);
			if (this.options.nextClass) {
				this._next.addClass(this.options.nextClass);
			}
			this._next.css({
				"top": offset.top + this.$.outerHeight() - this.$.height() + (this.$.height() - this._next.height()) / 2,
				"left": offset.left + this.$.outerWidth() - this.$.width() + (this.$.width() - this._next.width())
			});
			
			// Create pagination element
			this._pagination = $("<div class='harame-slider-pagination'></div>")
				.appendTo(this.$);
			if (this.options.paginationClass) {
				this._pagination.addClass(this.options.paginationClass);
			}
			this._pagination.css({
				"top": offset.top + this.$.outerHeight() - this._pagination.height(),
				"left": offset.left + this.$.outerWidth() - this.$.width() + (this.$.width() - this._pagination.width()) / 2
			});
			if (this.options.images) {
				var page;
				for (var i in this.options.images) {
					page = $("<div class='harame-slider-pagination-page'></div>")
						.appendTo(this._pagination);
					if (i == 0) {
						if (this.options.pageSelectedClass) {
							page.addClass(this.options.pageSelectedClass);
						}
					} else {
						if (this.options.pageClass) {
							page.addClass(this.options.pageClass);
						}
					}
				}
				this._pagination.width(this.options.images.length * page.width())
					.find(".harame-slider-pagination-page")
					.mouseenter(function() {
						that._slide($(this).index());
					})
			}
		},
		_slide: function(index, forward) {
			if (index >= 0) {
				this._imageContainer.find("a:eq(" + index + ")").show().siblings().hide();
			} else {
				var target;
				if (forward) {
					target = this._imageContainer.find("a:visible").prev();
					if (target.length == 0) {
						target = this._imageContainer.find("a:last");
					}
				} else {
					target = this._imageContainer.find("a:visible").next();
					if (target.length == 0) {
						target = this._imageContainer.find("a:first");
					}
				}
				target.show().siblings().hide();
				index = target.index();
			}
			this._pagination.find(".harame-slider-pagination-page:eq(" + index + ")")
				.addClass(this.options.pageSelectedClass)
				.removeClass(this.options.pageClass)
				.siblings().addClass(this.options.pageClass)
				.removeClass(this.options.pageSelectedClass);
		}
	});
})(jQuery);