var editor;

$(document).ready(function () {
    $('#PersonTableContainer').jtable({
        paging: true,
        sorting: true,
        actions: {
            listAction: '/postGetEventi',
            //createAction: '/GettingStarted/CreatePerson',
            updateAction: '/getUpdateEventi',
            deleteAction: '/getDeleteEventi'
        },
        fields: {
            _id: {
                key: true,
                list: false
            },
            titolo: {
                title: 'Titolo',
                width: '10%',
                type: 'textarea'
            },
            sottotitolo: {
                title: 'Sottotitolo',
                width: '10%',
                type: 'textarea'
            },
            luogo: {
                title: 'Luogo',
                width: '10%',
                type: 'textarea'
            },
            data: {
                title: 'Data Inizio',
                width: '5%',
                type: 'date',
                displayFormat: 'yy-mm-dd'
            },
            data_fine: {
                title: 'Data Fine',
                width: '5%',
                type: 'date',
                displayFormat: 'yy-mm-dd'
            },
            informazioni: {
                title: 'Informazioni:',
                width: '10%',
                type: 'textarea'
            },
            relatori: {
                title: 'Relatori:',
                width: '10%',
                type: 'textarea'
            },
            descrizione: {
                title: 'Descrizione:',
                width: '10%',
                visibility: 'hidden',
                type: 'textarea'
            }
        }
    });
    $('#PersonTableContainer').jtable('load');
});
