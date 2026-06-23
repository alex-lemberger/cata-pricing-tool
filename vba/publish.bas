Attribute VB_Name = "Publish"
Sub publish()
    
    Protect_all
    ThisWorkbook.Names("helper_automaticSharepointSave").RefersToRange.value = True
    ThisWorkbook.Names("helper_isPublished").RefersToRange.value = True
    
    Dim FileSystem As Object
    Dim hostFolder As String
    
    hostFolder = ThisWorkbook.Names("Grundordner_V").RefersToRange.value
    Set FileSystem = CreateObject("Scripting.FileSystemObject")
    
    ThisWorkbook.Names("\selected_ipflag").RefersToRange.value = "No"
    ThisWorkbook.Names("helper_isPublished").RefersToRange.value = True
    ThisWorkbook.Names("helper_automaticSharepointSave").RefersToRange.value = False
    
'    Dim hostFolderObj As Object
'    hostFolderObj = FileSystem.GetFolder(hostFolder)
'
'    Dim subFolder As Object
'    For Each subFolder In hostFolderObj.SubFolders
'        MsgBox subFolder.Name
'    Next
    
    Call showHide_relevantSheets(show:=False)
    
End Sub

Sub Protect_all()

    Dim ws As Worksheet
    Dim wsName As Variant
    For Each wsName In Array("Input", "Output", "Type of Goods", "Geographical Scope")
        Set ws = ThisWorkbook.Worksheets(CStr(wsName))
        Protect_sheet ws
    Next wsName
    
    For Each wsName In Array("ARGOS Data", "Algorithm", "Parameter", "References", "Info", _
                                "Anleitung", "Notes", "Type of Goods Back", "Language", _
                                "Error Correction", "MidMarket_Texts", "UWWB", "Infos_for_UWWB", _
                                "Programm Structure", "Basic Values", "Storage_Algorithm", _
                                "LoPo_Algorithm", "Storage_Parameters", "Dev_Sheet")
        Set ws = ThisWorkbook.Worksheets(wsName)
        ws.Visible = xlSheetVeryHidden
    Next wsName
        
End Sub

Sub Protect_sheet(ws As Worksheet)

        ws.Protect Password:="CaTa2022", DrawingObjects:=False, Contents:=True, Scenarios:= _
        False, AllowFormattingCells:=True, AllowFormattingColumns:=True, _
        AllowFormattingRows:=True, AllowInsertingRows:=True, AllowFiltering:=True

End Sub
