$.widget( "kalamu.kalamuDashboardSection", {

    options: {
        dashboard: null,
        type: null,
        title: null,
        identifier: null,
        params: null,
        rows: null
    },

    _create: function() {

        this.element.addClass('row kalamu-dashboard-section');
        
        delete_link = $('<a href="#" class="btn btn-danger btn-xs" title="'+Translator.trans('element.section.delete', {}, 'kalamu')+'"><i class="fa fa-trash"></i></a>');
        linkUp = $('<a href="#" class="btn btn-default btn-xs" title="'+Translator.trans('element.section.up', {}, 'kalamu')+'"><i class="fa fa-arrow-up"></i></a>');
        linkDown = $('<a href="#" class="btn btn-default btn-xs" title="'+Translator.trans('element.section.down', {}, 'kalamu')+'"><i class="fa fa-arrow-down"></i></a>');

        config_row = $('<div class="col-md-12 visible-editing visible-editing-section text-right">').append(linkUp).append(linkDown).append(delete_link);
        this.element.append(config_row);
        
        this._on( delete_link, { click: this._delete });
        this._on( linkUp, { click: this.up });
        this._on( linkDown, { click: this.down });
        
        this.options.editLink = $('<a href="#" title="'+Translator.trans('element.sections.edit.link', {}, 'kalamu')+'"><strong class="text-muted section-name"></strong></a>');
        this.element.append( $('<div class="section-config"></div>').append(this.options.editLink) )
        this._on(this.options.editLink, { 'click': this.editElement });
        
        this.options.innerDashboard = $('<div>');
        this.element.append(this.options.innerDashboard);
        this.options.innerDashboard.kalamuDashboard({
            explorerWidget: this.options.dashboard.options.explorerWidget,
            enable_widget: true,
            enable_section: false
        });
        if(this.options._content){
            this.options.innerDashboard.kalamuDashboard('import', this.options._content);
        }
        
        this._updateTitle();
        
    },
    
    /**
     * Update the title of the Section
     * @returns {undefined}
     */
    _updateTitle: function(){
        this.options.dashboard.options.explorerSection.kalamuElementExplorer('loadElementInfos', this.options.identifier, this.options.params, $.proxy(function(datas){
            this.options.title = datas.title;
            this.options.editLink.find('.section-name').text(this.options.title);
        }, this));
    },
    
    editElement: function(e){
        e.preventDefault();
        this.options.dashboard.options.explorerSection.kalamuElementExplorer('showElementInfos', this.options.identifier, this.options.params);

        updateElementFct = $.proxy(this.updateElement, this);
        this.options.dashboard.options.explorerSection.on('kalamu.dashboard.valid_element', updateElementFct);
        this.options.dashboard.options.explorerSection.on('kalamu.dashboard.close_explorer', $.proxy(function(updateElementFct){
            this.options.dashboard.options.explorerSection.off('kalamu.dashboard.valid_element', updateElementFct);
        }, this, updateElementFct));
    },
    
    updateElement: function(e, infos){
        this.options.identifier = infos.identifier;
        this.options.params = infos.params;
        
        this._updateTitle();
    },
    
    export: function(){
        var json = {
            type: this.options.type,
            identifier: this.options.identifier,
            params: this.options.params,
        };
        json._content = this.options.innerDashboard.kalamuDashboard('export');
        
        return json;
    },

    up: function(e){
        e.preventDefault();
        if(this.element.prev().not('.stick-top').length){
            this.element.prev().before( this.element.detach() );
            this.options.dashboard.element.trigger("kalamu.dashboard.move_section");
        }
    },

    down: function(e){
        e.preventDefault();
        if(this.element.next().not('.stick-bottom').length){
            this.element.next().after( this.element.detach() );
            this.options.dashboard.element.trigger("kalamu.dashboard.move_section");
        }
    },

    _delete: function(e){
        e.preventDefault();
        this.element.remove();
        this.options.dashboard.element.trigger("kalamu.dashboard.delete_section");
    }

});