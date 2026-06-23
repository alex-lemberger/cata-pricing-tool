Attribute VB_Name = "DieseArbeitsmappe"
Attribute VB_Base = "0{00020819-0000-0000-C000-000000000046}"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = True
Attribute VB_TemplateDerived = False
Attribute VB_Customizable = True
Private Sub Workbook_AfterSave(ByVal Success As Boolean)

    If Not ThisWorkbook.Names("helper_isPublished").RefersToRange.value Then
        Exit Sub
    End If
    
    Call showHide_relevantSheets(show:=True)

End Sub

Private Sub Workbook_BeforeSave(ByVal SaveAsUI As Boolean, Cancel As Boolean)
    
    If ThisWorkbook.Names("helper_isPublished").RefersToRange.value Then
        Call showHide_relevantSheets(show:=False)
    End If
    
End Sub

Private Sub Workbook_Open()
    
    If ThisWorkbook.Names("helper_isPublished").RefersToRange.value Then
        Call showHide_relevantSheets(show:=True)
    End If
    
End Sub
