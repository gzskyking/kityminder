KM.registerToolbarUI( 'saveto', function ( name ) {

    var me = this,
        label = me.getLang( 'tooltips.' + name ),
        options = {
            label: label,
            title: label,
            comboboxName: name,
            items: [],
            itemStyles: [],
            value: [],
            autowidthitem: [],
            enabledRecord: false
        },
        $combox = null,
        comboboxWidget = null;

    utils.each( KityMinder.getAllRegisteredProtocals(), function ( k ) {
        var p = KityMinder.findProtocal( k );
        if ( p.encode ) {
            var text = p.fileDescription + '（' + p.fileExtension + '）';
            options.value.push( k );
            options.items.push( text );
            options.autowidthitem.push( $.wordCountAdaptive( text ), true );
        }
    } );


    //实例化
    $combox = $.kmuibuttoncombobox( options ).css( 'zIndex', me.getOptions( 'zIndex' ) + 1 );
    comboboxWidget = $combox.kmui();

    function doDownload( url, filename ) {
        var a = document.createElement( 'a' );
        a.setAttribute( 'download', filename );
        a.setAttribute( 'href', url );
        var evt;
        try {
            evt = new MouseEvent( 'click' );
        } catch ( error ) {
            evt = document.createEvent( 'MouseEvents' );
            evt.initEvent( 'click', true, true );
        }
        a.dispatchEvent( evt );
    }

    var ie_ver = function () {
        var iev = 0;
        var ieold = ( /MSIE (\d+\.\d+);/.test( navigator.userAgent ) );
        var trident = !! navigator.userAgent.match( /Trident\/7.0/ );
        var rv = navigator.userAgent.indexOf( "rv:11.0" );
        if ( ieold ) iev = new Number( RegExp.$1 );
        if ( navigator.appVersion.indexOf( "MSIE 10" ) != -1 ) iev = 10;
        if ( trident && rv != -1 ) iev = 11;
        return iev;
    };
    comboboxWidget.on( 'comboboxselect', function ( evt, res ) {
        var data = me.exportData( res.value );
        var p = KityMinder.findProtocal( res.value );
        var filename = me.getMinderTitle() + p.fileExtension;
        if ( typeof ( data ) == 'string' ) {
            var url = 'data:text/plain; utf-8,' + encodeURIComponent( data );
            if ( ie_ver() > 0 ) {
                console.log( "IE" );
                var iframe = document.createElement( 'iframe' );
                //iframe.style.display = 'none';
                document.appendChild( iframe );
                iframe.src = filename;
                iframe.contentDocument.body.innerHTML = data;
                iframe.contentDocument.execCommand( "SaveAs" );
                //document.removeChild( iframe );
            } else {
                doDownload( url, filename );
            }
        } else if ( data && data.then ) {
            data.then( function ( url ) {
                doDownload( url, filename );
            } );
        }
    } ).on( "beforeshow", function () {
        if ( $combox.parent().length === 0 ) {
            $combox.appendTo( me.$container.find( '.kmui-dialog-container' ) );
        }
    } ).on( 'aftercomboboxselect', function () {
        this.setLabelWithDefaultValue();
    } );



    return comboboxWidget.button().addClass( 'kmui-combobox' );

} );