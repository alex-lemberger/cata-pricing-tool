Attribute VB_Name = "Storage_ImportExport"
Sub importRequest()

    file = Application.GetOpenFilename(FileFilter:="Excel Workbook (*.xls; *.xlsb; *.xlsx; *.xlsm),*.xls;*.xlsb;*.xlsx;*.xlsm" _
                                                    , title:="Choose data file for input")
    If file = False Then
        MsgBox "No File has been chosen."
        Exit Sub
    End If
    
    Dim StorageImportWB As Workbook
    Set StorageImportWB = Workbooks.Open(file)
    
    Dim i As Integer
    Dim StorageDataType As String
    Dim isValidImport As Boolean
    For i = 1 To ThisWorkbook.Names("\storageParams_Import_Types").RefersToRange.Rows.Count
        StorageDataType = ThisWorkbook.Names("\storageParams_Import_Types").RefersToRange(i, 1).value
        isValidImport = isLocationWB(StorageImportWB, StorageDataType)
        If isValidImport Then
            Exit For
        End If
    Next i
    
    If (Not isValidImport) Then
        MsgBox "The chosen Workbook was not registered as a valid Workbook for Location Imports." & _
            Chr(10) & "Accepted Workbooks are the MarineDB Export and the ARGOS Import sheet." & _
            Chr(10) & "The import will abort now."
        Exit Sub
    End If
    Call importExecution(importWB:=StorageImportWB, StorageDataType:=StorageDataType)
    
End Sub

Sub importExecution(importWB As Workbook, StorageDataType As String)

    Dim inputWS As Worksheet
    Dim outputWS As Worksheet
    Set outputWS = ThisWorkbook.Worksheets("Storage_Input")
    Set inputWS = importWB.Worksheets(ThisWorkbook.Names("\StorageParams_Import_" & StorageDataType & "_SheetName").RefersToRange.value)
    
    Dim inputColCount As Integer
    inputColCount = ThisWorkbook.Names("\storageParams_Import_" & StorageDataType & "_ColumnNames").RefersToRange.Rows.Count
    Dim totalColumns As Integer
    totalColumns = ThisWorkbook.Names("\storageParams_ColumnCount").RefersToRange.value
    
    Dim startColumn As Integer
    startColumn = ThisWorkbook.Names("\paramhelper_StorageTableStartColumn").RefersToRange.Column
    
    Dim rowOffset As Integer
    rowOffset = ThisWorkbook.Names("\storageParams_Import_" & StorageDataType & "_HeaderRow").RefersToRange.value
    rowOffset = rowOffset + 1
    
    Dim i As Integer
    Dim j As Integer
    Dim maxRow As Integer
    With inputWS
        maxRow = .Cells(.UsedRange.Rows.Count + 1, 1).End(xlUp).Row
    End With
    
    
    Dim importArray() As Variant
    Dim totalRowCount
    totalRowCount = maxRow - rowOffset + 1
    ReDim importArray(1 To totalRowCount, 1 To totalColumns)
    
    Dim colArray() As Variant
    colArray = ThisWorkbook.Names("\storageParams_Import_" & StorageDataType & "_ColumnIndex").RefersToRange.value
    For i = 1 To totalRowCount
        'Skip Row if entry has no id-number
        If Not IsNumeric(inputWS.Cells(i + rowOffset - 1, 1).value) Then GoTo skipRow
        For j = 1 To inputColCount
            If IsEmpty(colArray(j, 1)) Then GoTo skipCol
            If j > 10 Then 'ImportSheet MarineDB and ARGOSImport have columns
                            'where numbers are stored with "wrong" decimal separators
                importArray(i, colArray(j, 1)) = Replace(inputWS.Cells(i + rowOffset - 1, j).value, ",", ".")
            Else
                importArray(i, colArray(j, 1)) = Replace(inputWS.Cells(i + rowOffset - 1, j).value, ".", ",")
            End If
skipCol:
        Next j
skipRow:
    Next i
    
    rowOffset = ThisWorkbook.Names("\paramhelper_StorageTableStartColumn").RefersToRange.Row + 1
    Dim usedRangeCount As Integer
    usedRangeCount = ThisWorkbook.Worksheets("Storage_Input").UsedRange.Rows.Count
    With outputWS
        .Range(.Cells(rowOffset, startColumn), .Cells(usedRangeCount, totalColumns + startColumn - 1)).Delete Shift:=xlShiftUp
        .Range(.Cells(rowOffset, startColumn), _
                .Cells(rowOffset + UBound(importArray) - 1, totalColumns + startColumn - 1)).value = importArray
    End With
    
    'Identify empty columns (except ID) and delete them
    Dim rowsToDelete() As Integer
    ReDim rowsToDelete(0 To 0)
    With outputWS
        maxRow = .UsedRange.Rows.Count
        rowOffset = ThisWorkbook.Names("\paramhelper_StorageTableStartColumn").RefersToRange.Row + 1
        Dim keepRow As Boolean
        For i = maxRow To rowOffset Step -1
            keepRow = False
            For j = startColumn + 1 To totalColumns
                If Not IsEmpty(.Cells(i, j)) Then keepRow = True
            Next j
            
            If Not keepRow Then
                ReDim Preserve rowsToDelete(0 To (UBound(rowsToDelete) + 1))
                rowsToDelete(UBound(rowsToDelete)) = i
            End If
        Next i
        
        If UBound(rowsToDelete) > 0 Then
            Dim rngToDelete As Range
            i = 1
            Set rngToDelete = .Range(.Cells(rowsToDelete(i), startColumn), .Cells(rowsToDelete(i), totalColumns + startColumn - 1))
            If UBound(rowsToDelete) > 1 Then
                For i = 2 To UBound(rowsToDelete)
                    Set rngToDelete = Union(rngToDelete, .Range(.Cells(rowsToDelete(i), startColumn), .Cells(rowsToDelete(i), totalColumns + startColumn - 1)))
                Next i
            End If
            rngToDelete.Delete Shift:=xlShiftUp
        End If
    End With
    
End Sub

Function isLocationWB(unknownWB As Workbook, StorageDataType As String) As Boolean

    isLocationWB = False
    
    Dim containsSheet As Boolean
    Dim sheetName As String
    sheetName = ThisWorkbook.Names("\storageParams_Import_" & StorageDataType & "_SheetName").RefersToRange.value
    On Error Resume Next
    containsSheet = (unknownWB.Worksheets(sheetName).Name = sheetName)
    On Error GoTo 0
    If Not containsSheet Then
        Exit Function
    End If
    
    Dim headerRow As Integer
    headerRow = ThisWorkbook.Names("\storageParams_Import_" & StorageDataType & "_HeaderRow").RefersToRange.value
    Dim headerNamesRange As Range
    Set headerNamesRange = ThisWorkbook.Names("\storageParams_Import_" & StorageDataType & "_ColumnNames").RefersToRange
    
    Dim i As Integer
    For i = 1 To headerNamesRange.Rows.Count
        If unknownWB.Worksheets(sheetName).Cells(headerRow, i).value <> headerNamesRange(i, 1).value Then
            Exit Function
        End If
    Next i
    
    isLocationWB = True

End Function
