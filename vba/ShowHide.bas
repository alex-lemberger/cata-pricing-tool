Attribute VB_Name = "ShowHide"
Sub ShowHide_Midmarket(show As Boolean)
    
    Dim i As Integer
    With ThisWorkbook
        For i = 1 To 3
            .Names("\showHide_MidMarket_" & i).RefersToRange.EntireRow.Hidden = Not show
        Next i
    End With

    Call showHide_CheckBoxes(show:=show)
    Call CheckBox_DetailedGeographicalScope
    Call CheckBox_TransportationType
    
End Sub

Sub ShowHide_MidmarketOutput(show As Boolean)
    
    With ThisWorkbook
        .Names("\showHide_MidMarket_Output_1").RefersToRange.EntireRow.Hidden = Not show
        .Names("\showHide_MidMarket_Output_2").RefersToRange.EntireRow.Hidden = show
    End With

End Sub

Sub showHide_GeoScopeDetail()

    ThisWorkbook.Names("\showHide_GeoScope_Detail").RefersToRange.EntireRow.Hidden = _
        (Not ThisWorkbook.Names("helper_geographicalScope_detailedView").RefersToRange.value)

End Sub

Sub showHide_TransportationType(show As Boolean)

    ThisWorkbook.Names("\showHide_TransportationType").RefersToRange.EntireRow.Hidden = _
        (Not show)

End Sub

Sub showHide_CheckBoxes(show As Boolean)

    Dim inputWS As Worksheet
    Set inputWS = ThisWorkbook.Worksheets("Input")
    
    Dim shapeVisible As MsoTriState
    If show = True Then
        shapeVisible = msoTrue
    Else
        shapeVisible = msoFalse
    End If
    
    inputWS.Shapes("CB_TransportationType").ControlFormat.value = -4146
    inputWS.Shapes("CB_DetailedGeographicalScope").ControlFormat.value = -4146
    inputWS.Shapes("CB_TransportationType").Visible = shapeVisible
    inputWS.Shapes("CB_DetailedGeographicalScope").Visible = shapeVisible
    
End Sub

Sub showHide_relevantSheets(show As Boolean)
    
    Dim sheetNames() As Variant
    
    sheetNames = Array("Makro_Checker")
    Call showHide_Sheets(sheetNames, True)
    
    sheetNames = Array("Input", "Storage_Input", "Output", "Type of Goods", "Geographical Scope")
    Call showHide_Sheets(sheetNames, show)
    
    sheetNames = Array("Makro_Checker")
    Call showHide_Sheets(sheetNames, Not show)
    
End Sub

Sub showHide_loPos(show As Boolean)
    
    Dim sheetNames() As Variant
    
    sheetNames = Array("Local_Policies")
    Call showHide_Sheets(sheetNames, show)
    
End Sub

Sub showHide_Sheets(sheetNames() As Variant, show As Boolean)
    
    Dim sheetName As Variant
    
    Dim xlShow As XlSheetVisibility: xlShow = IIf(show, xlSheetVisible, xlSheetVeryHidden)
    
    Dim screenUpdating As Boolean: screenUpdating = Application.screenUpdating
    Application.screenUpdating = False
    For Each sheetName In sheetNames
        ThisWorkbook.Worksheets(sheetName).Visible = xlShow
    Next sheetName
    Application.screenUpdating = screenUpdating
    
End Sub
