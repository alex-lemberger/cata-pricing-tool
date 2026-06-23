Attribute VB_Name = "prefill_Wordings"
Function wordingNumber(wordingName As String) As Integer
    
    wordingNumber = -1
    
    Dim wordingRng As Range
    Set wordingRng = ThisWorkbook.Worksheets("References").Range("\reference_covertype2_MidMarket")
    
    Dim i As Integer
    For i = 1 To wordingRng.Rows.Count
        If wordingName = wordingRng(i, 1).value Then wordingNumber = i
    Next i
    
End Function

Sub preFill()
    
    Dim screenUpdating As Boolean
    screenUpdating = Application.screenUpdating
    Application.screenUpdating = False
    
    Dim wordingName As String
    wordingName = ThisWorkbook.Names("\selected_typeofcover2").RefersToRange.value
    
    Dim col As Integer
    col = wordingNumber(wordingName)
    
    If col = -1 Then Exit Sub
    
    Dim paramRng As Range
    Set paramRng = ThisWorkbook.Names("\parameter_MidMarketChanges_typeofCover2PreDefined").RefersToRange
    
    Dim cellName As String
    Dim i As Integer
    Dim value As Variant
    For i = 1 To paramRng.Rows.Count
        value = paramRng(i, col + 2).value
        cellName = paramRng(i, 1).value
        If Not (IsEmpty(value)) Then
            If paramRng(i, 2).value = "Name" Then
                ThisWorkbook.Names(cellName).RefersToRange.value = paramRng(i, col + 2).value
            ElseIf paramRng(i, 2).value = "Shape" Then
                ThisWorkbook.Worksheets("Input").Shapes(cellName).ControlFormat.value = _
                    IIf(paramRng(i, col + 2).value = "Yes", xlOn, xlOff)
            End If
            
        End If
    Next i

    Application.screenUpdating = screenUpdating
    
End Sub

Sub ClearInputSheetRequest()
    
    Dim response As VbMsgBoxResult
    response = MsgBox(prompt:="Do you really want to clear all inputs?", Buttons:=vbOKCancel, title:="Clear Inputs...")
    
    If response = vbCancel Then
        Exit Sub
    End If
    
    Call ClearInputSheet
    
End Sub

Sub ClearInputSheet()
    
    Dim screenUpdating As Boolean
    screenUpdating = Application.screenUpdating
    Application.screenUpdating = False
    
    Dim currentName As Name
    Dim searchString As Variant
    
    Dim shp As Shape
    For Each shp In ThisWorkbook.Worksheets("Input").Shapes
        If shp.Type = msoFormControl Then
            If shp.FormControlType = xlCheckBox Then
                If shp.ControlFormat.value <> xlOff Then
                    shp.ControlFormat.value = xlOff
                End If
            End If
        End If
    Next shp
    
    For Each currentName In ThisWorkbook.Names
        For Each searchString In Array("\selected_", "Geoscope_int_")
            If Left(currentName.Name, Len(searchString)) = searchString Then
                If Right(currentName.Name, 3) = "_Sp" Then 'Don't Clear header column of Geoscope
                    Exit For
                End If
                
                If currentName.RefersToRange.MergeCells Then
                    If Not (IsEmpty(currentName.RefersToRange.MergeArea)) Then
                        currentName.RefersToRange.MergeArea.ClearContents
                    End If
                Else
                    If Not (IsEmpty(currentName.RefersToRange)) Then
                        currentName.RefersToRange.ClearContents
                    End If
                End If
                Exit For
            End If
        Next searchString
    Next currentName
    
    Dim rng1 As Range
    Dim rng2 As Range
    Set rng1 = ThisWorkbook.Names("helper_technicalAdjustmentFirstAdjustment").RefersToRange
    Set rng2 = ThisWorkbook.Names("helper_technicalAdjustmentStopper").RefersToRange
    If (rng2.Row - rng1.Row) > 1 Then
        Range(rng1.Offset(1, 0), rng2.Offset(-1, 0)).EntireRow.Delete
    End If
    rng1.ClearContents
    rng1.Offset(0, -1).ClearContents
    
    ThisWorkbook.Worksheets("Input").UsedRange.EntireRow.Hidden = False
    ThisWorkbook.Names("\selected_country1_Krieg").RefersToRange.EntireRow.Hidden = True
    ThisWorkbook.Names("\selected_country1_Streik").RefersToRange.EntireRow.Hidden = True
    
    Application.screenUpdating = screenUpdating
    
End Sub
