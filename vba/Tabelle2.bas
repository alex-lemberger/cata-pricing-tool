Attribute VB_Name = "Tabelle2"
Attribute VB_Base = "0{00020820-0000-0000-C000-000000000046}"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = True
Attribute VB_TemplateDerived = False
Attribute VB_Customizable = True

Private Sub Worksheet_Change(ByVal Target As Range)
    
    With ThisWorkbook
        If Not (Intersect(Target, .Names("\selected_MidMarketNewBusiness").RefersToRange) Is Nothing) Then
            If .Names("\selected_MidMarketNewBusiness").RefersToRange.value = "Yes" Then
                ShowHide_Midmarket False
                If .Names("\selected_riskcountry").RefersToRange.value = "Germany" Then
                    Call ShowHide_MidmarketOutput(show:=False)
                End If
            ElseIf .Names("\selected_MidMarketNewBusiness").RefersToRange.value = "No" Then
                ShowHide_Midmarket True
                Call ShowHide_MidmarketOutput(show:=True)
            End If
        End If
        
        If Not (Intersect(Target, .Names("\selected_riskcountry").RefersToRange) Is Nothing) Then
            If .Names("\selected_MidMarketNewBusiness").RefersToRange.value = "Yes" Then
                If .Names("\selected_riskcountry").RefersToRange.value = "Germany" Then
                    Call ShowHide_MidmarketOutput(show:=False)
                Else
                
                End If
            End If
        End If
        
        If Not (Intersect(Target, .Names("\selected_typeofcover2").RefersToRange) Is Nothing) Then
            Call preFill
        End If
        
        If Not (Intersect(Target, .Names("\selected_ipflag").RefersToRange) Is Nothing) Then
            Call showHide_loPos(show:=(.Names("\selected_ipflag").RefersToRange.value = "Yes"))
        End If
        
        If Not (Intersect(Target, .Names("helper_technicalAdjustmentStopper").RefersToRange.Offset(-1, 0)) Is Nothing) Then
            Call addRowToTechnicalAdjustments
        End If
    End With
    ' -----------------------------------------------------------------------------------------
    ' ----- Makro von Uwe Haleksy, Dezember 2021 ----------------------------------------------
    ' ----- Hilfsmakro
    ' -----------------------------------------------------------------------------------------
    ' --- Info --------------------------------------------------------------------------------
    ' Dieses Makro
    ' - aktualisiert die Formeln in der Zeile wenn Additional Coverages auf "No" gestellt wird.
    ' - löscht die untergeordneten Einträge in der Type-of-Goods-Auswahl, wenn ein darüber-
    ' liegender Eintrag geändert wird.
    ' - setzt Schreibschutz aufs Blatt oder hebt ihn auf, wenn der \selected_status geändert wird.
    ' -----------------------------------------------------------------------------------------
Dim CgZ As Integer, TZ As Integer, t As Range, z As Range, DateiName, Selektion As Range

    ' -------------------------------------------------------------
    ' Aktualisierung der Formeln im Bereich Additional Coverages
    
    ' Fällt weg weil Uwe Makros nicht gut sind.

    ' -------------------------------------------------------------
    ' Type of Goods Class 1 wird geändert --> löschen alle darunter
    On Error GoTo Raus1
    If Not Target(1).Address = Range("\selected_typeofgoods_Class1").Address Then
        GoTo Raus1
    Else
        If Range("\selected_typeofgoods_SClass1") = "" Then
            Range("\selected_typeofgoods_TClass1").MergeArea.ClearContents
            Range("\selected_typeofgoods_ThClass1").MergeArea.ClearContents
            If Sheets("References").Range("Type_of_goods_1") = "X" Then
                Range("\selected_typeofgoods_SClass1").Select
            End If
        Else
            Range("\selected_typeofgoods_SClass1").MergeArea.ClearContents
            Range("\selected_typeofgoods_TClass1").MergeArea.ClearContents
            Range("\selected_typeofgoods_ThClass1").MergeArea.ClearContents
            If Sheets("References").Range("Type_of_goods_1") = "X" Then
                Range("\selected_typeofgoods_SClass1").Select
            Else
                Range("\selected_typeofgoods_TClass1").Select
            End If
        End If
        If Range("\selected_typeofgoods_Class1") = "" Then
            ' Class 1 ist leer
        Else
            ' Spalte Type of Goods in Location-Liste durchgehen
            If Sheets("References").Range("Type_of_goods_1") <> "X" Then
                For Each z In Intersect(Range("LL_Eintraege").EntireRow, Range("Argos_Type_of_Goods").EntireColumn)
                    If z <> Sheets("References").Range("Type_of_goods_1") And z <> Sheets("References").Range("Type_of_goods_2") And z <> Sheets("References").Range("Type_of_goods_3") Then
                        z.MergeArea.ClearContents
                    End If
                Next z
            End If
        End If
    End If
    Resume Raus1
Raus1:
    On Error GoTo 0

    ' Type of Goods SubClass 1 wird geändert --> löschen alle darunter
    On Error GoTo Raus11
    If Not Target(1).Address = Range("\selected_typeofgoods_SClass1").Address Then
        GoTo Raus11
    Else
        Range("\selected_typeofgoods_TClass1").MergeArea.ClearContents
        Range("\selected_typeofgoods_ThClass1").MergeArea.ClearContents
    End If
    Resume Raus11
Raus11:
    On Error GoTo 0

    ' Spalte Type of Goods in Location-Liste durchgehen
    On Error GoTo Raus111
    If Not Target(1).Address = Range("\selected_typeofgoods_SClass1").Address Then
        GoTo Raus111
    Else
        If ThisWorkbook.Names("Type_of_goods_1").RefersToRange.value <> "X" Then
'            For Each z In Intersect(Range("LL_Eintraege").EntireRow, Range("Argos_Type_of_Goods").EntireColumn)
'                If z <> ThisWorkbook.Names("Type_of_goods_1").RefersToRange.value And z <> ThisWorkbook.Names("Type_of_goods_2").RefersToRange.value And z <> ThisWorkbook.Names("Type_of_goods_3").RefersToRange.value Then
'                    z.MergeArea.ClearContents
'                End If
'            Next z
        End If

    End If
    Resume Raus111
Raus111:
    On Error GoTo 0

    ' -------------------------------------------------------------
    ' Type of Goods Class 2 wird geändert --> löschen alle darunter
    On Error GoTo Raus2
    If Not Target(1).Address = Range("\selected_typeofgoods_Class2").Address Then
        GoTo Raus2
    Else
        If Range("\selected_typeofgoods_Class2") <> "" And Range("\selected_typeofgoods_Class1_Split") = 1 Then
            ' Wenn zweite Type of Goods dazukommt, die 100% bei der ersten löschen
            Range("\selected_typeofgoods_Class1_Split").ClearContents
        End If
        If Range("\selected_typeofgoods_SClass2") = "" Then
            Range("\selected_typeofgoods_TClass2").MergeArea.ClearContents
            Range("\selected_typeofgoods_ThClass2").MergeArea.ClearContents
            If Range("Type_of_goods_2") = "X" Then
                Range("\selected_typeofgoods_SClass2").Select
            End If
        Else
            Range("\selected_typeofgoods_SClass2").MergeArea.ClearContents
            Range("\selected_typeofgoods_TClass2").MergeArea.ClearContents
            Range("\selected_typeofgoods_ThClass2").MergeArea.ClearContents
            If Sheets("References").Range("Type_of_goods_2") = "X" Then
                Range("\selected_typeofgoods_SClass2").Select
            Else
                Range("\selected_typeofgoods_TClass2").Select
            End If
        End If
        If Range("\selected_typeofgoods_Class2") = "" Then
            ' Class 2 ist leer
        Else
            ' Spalte Type of Goods in Location-Liste durchgehen
            If Sheets("References").Range("Type_of_goods_2") <> "X" Then
                For Each z In Intersect(Range("LL_Eintraege").EntireRow, Range("Argos_Type_of_Goods").EntireColumn)
                    If z <> Sheets("References").Range("Type_of_goods_1") And z <> Sheets("References").Range("Type_of_goods_2") And z <> Sheets("References").Range("Type_of_goods_3") Then
                        z.MergeArea.ClearContents
                    End If
                Next z
            End If
        End If
    End If
    Resume Raus2
Raus2:
    On Error GoTo 0

    ' Type of Goods SubClass 2 wird geändert --> löschen alle darunter
    On Error GoTo Raus22
    If Not Target(1).Address = Range("\selected_typeofgoods_SClass2").Address Then
        GoTo Raus22
    Else
        Range("\selected_typeofgoods_TClass2").MergeArea.ClearContents
        Range("\selected_typeofgoods_ThClass2").MergeArea.ClearContents
    End If
    Resume Raus22
Raus22:
    On Error GoTo 0

    ' Spalte Type of Goods in Location-Liste durchgehen
    On Error GoTo Raus222
    If Not Target(1).Address = Range("\selected_typeofgoods_SClass2").Address Then
        GoTo Raus222
    Else
        If ThisWorkbook.Names("Type_of_goods_2").RefersToRange.value <> "X" Then
'            For Each z In Intersect(Range("LL_Eintraege").EntireRow, Range("Argos_Type_of_Goods").EntireColumn)
'                If z <> ThisWorkbook.Names("Type_of_goods_1").RefersToRange.value And z <> ThisWorkbook.Names("Type_of_goods_2").RefersToRange.value And z <> ThisWorkbook.Names("Type_of_goods_3").RefersToRange.value Then
'                    z.MergeArea.ClearContents
'                End If
'            Next z
        End If

    End If
    Resume Raus222
Raus222:
    On Error GoTo 0

    ' -------------------------------------------------------------
    ' Type of Goods Class 3 wird geändert --> löschen alle darunter
    On Error GoTo Raus3
    If Not Target(1).Address = Range("\selected_typeofgoods_Class3").Address Then
        GoTo Raus3
    Else
        If Range("\selected_typeofgoods_SClass3") = "" Then
            Range("\selected_typeofgoods_TClass3").MergeArea.ClearContents
            Range("\selected_typeofgoods_ThClass3").MergeArea.ClearContents
            If Range("Type_of_goods_3") = "X" Then
                Range("\selected_typeofgoods_SClass3").Select
            End If
        Else
            Range("\selected_typeofgoods_SClass3").MergeArea.ClearContents
            Range("\selected_typeofgoods_TClass3").MergeArea.ClearContents
            Range("\selected_typeofgoods_ThClass3").MergeArea.ClearContents
            If Sheets("References").Range("Type_of_goods_3") = "X" Then
                Range("\selected_typeofgoods_SClass3").Select
            Else
                Range("\selected_typeofgoods_TClass3").Select
            End If
        End If
        If Range("\selected_typeofgoods_Class3") = "" Then
            ' Class 3 ist leer
        Else
            ' Spalte Type of Goods in Location-Liste durchgehen
            If Sheets("References").Range("Type_of_goods_3") <> "X" Then
                For Each z In Intersect(Range("LL_Eintraege").EntireRow, Range("Argos_Type_of_Goods").EntireColumn)
                    If z <> Sheets("References").Range("Type_of_goods_1") And z <> Sheets("References").Range("Type_of_goods_2") And z <> Sheets("References").Range("Type_of_goods_3") Then
                        z.MergeArea.ClearContents
                    End If
                Next z
            End If
        End If
    End If
    Resume Raus3
Raus3:
    On Error GoTo 0

    ' Type of Goods SubClass 3 wird geändert --> löschen alle darunter
    On Error GoTo Raus33
    If Not Target(1).Address = Range("\selected_typeofgoods_SClass3").Address Then
        GoTo Raus33
    Else
        Range("\selected_typeofgoods_TClass3").MergeArea.ClearContents
        Range("\selected_typeofgoods_ThClass3").MergeArea.ClearContents
    End If
    Resume Raus33
Raus33:
    On Error GoTo 0

    ' Spalte Type of Goods in Location-Liste durchgehen
    On Error GoTo Raus333
    If Not Target(1).Address = Range("\selected_typeofgoods_SClass3").Address Then
        GoTo Raus333
    Else
        If ThisWorkbook.Names("Type_of_goods_3").RefersToRange.value <> "X" Then
'            For Each z In Intersect(Range("LL_Eintraege").EntireRow, Range("Argos_Type_of_Goods").EntireColumn)
'                If z <> ThisWorkbook.Names("Type_of_goods_1").RefersToRange.value And z <> ThisWorkbook.Names("Type_of_goods_2").RefersToRange.value And z <> ThisWorkbook.Names("Type_of_goods_3").RefersToRange.value Then
'                    z.MergeArea.ClearContents
'                End If
'            Next z
        End If

    End If
    Resume Raus333
Raus333:
    On Error GoTo 0

    ' -------------------------------------------------------------
    ' Wenn Krieg auf YES gesetzt wird
    On Error GoTo Raus4
    If Not Target(1).Address = Range("\selected_additional_YesNo_Krieg").Address Then
        GoTo Raus4
    Else
        If Range("\selected_additional_YesNo_Krieg") = "Yes" Then
            'Range("\selected_additional_YesNo_Krieg").Offset(1, 0).EntireRow.Hidden = False
            'Range("\selected_additional_YesNo_Krieg").Offset(1, 2).ClearContents
            'Range("\selected_additional_YesNo_Krieg").Offset(1, 2).Select
        Else
            
            Dim countryCountWar As Integer
            countryCountWar = ThisWorkbook.Names("helper_countryCount_war").RefersToRange.value
            If countryCountWar > 1 Then
                Set Selektion = Range(ThisWorkbook.Names("\selected_additional_YesNo_Krieg").RefersToRange.Offset(2, 0), _
                    ThisWorkbook.Names("\selected_additional_YesNo_Krieg").RefersToRange.Offset(countryCountWar, 0))
                Selektion.EntireRow.Delete
                Set Selektion = Range("\selected_additional_YesNo_Krieg").Offset(1, 2)
                With Selektion.Borders(xlEdgeBottom)
                    .LineStyle = xlContinuous
                    .Weight = xlMedium
                    .Color = RGB(0, 0, 0)
                End With
                Set Selektion = Range(Range("\selected_additional_YesNo_Krieg").Offset(1, 4), _
                    Range("\selected_additional_YesNo_Krieg").Offset(1, 8))
                With Selektion.Borders(xlEdgeBottom)
                    .LineStyle = xlContinuous
                    .Weight = xlMedium
                    .Color = RGB(0, 0, 0)
                End With
            Else
            End If

            Range("\selected_additional_YesNo_Krieg").Offset(1, 2).ClearContents
            Range("\selected_additional_YesNo_Krieg").Offset(1, 0).EntireRow.Hidden = True
        End If
    End If
    Resume Raus4
Raus4:
    On Error GoTo 0

    ' -------------------------------------------------------------
    ' Wenn Streik auf YES gesetzt wird
    On Error GoTo Raus5
    If Not Target(1).Address = Range("\selected_additional_YesNo_Streik").Address Then
        GoTo Raus5
    Else
        If Range("\selected_additional_YesNo_Streik") = "Yes" Then
            'Range("\selected_additional_YesNo_Streik").Offset(1, 0).EntireRow.Hidden = False
            'Range("\selected_additional_YesNo_Streik").Offset(1, 2).ClearContents
            'Range("\selected_additional_YesNo_Streik").Offset(1, 2).Select
        Else
            Dim countryCountSrikeAndRiot As Integer
            countryCountSrikeAndRiot = ThisWorkbook.Names("helper_countryCount_strikeAndRiot").RefersToRange.value
            If countryCountSrikeAndRiot > 1 Then
                Set Selektion = Range(ThisWorkbook.Names("\selected_additional_YesNo_Streik").RefersToRange.Offset(2, 0), _
                    ThisWorkbook.Names("\selected_additional_YesNo_Streik").RefersToRange.Offset(countryCountWar, 0))
                Selektion.EntireRow.Delete

                Set Selektion = Range("\selected_additional_YesNo_Streik").Offset(1, 2)
                With Selektion.Borders(xlEdgeBottom)
                    .LineStyle = xlContinuous
                    .Weight = xlMedium
                    .Color = RGB(0, 0, 0)
                End With
                Set Selektion = Range(Range("\selected_additional_YesNo_Streik").Offset(1, 4), _
                    Range("\selected_additional_YesNo_Streik").Offset(1, 8))
                With Selektion.Borders(xlEdgeBottom)
                    .LineStyle = xlContinuous
                    .Weight = xlMedium
                    .Color = RGB(0, 0, 0)
                End With
            Else
                Set Selektion = Range("\selected_additional_YesNo_Streik").Offset(2, 2)
                With Selektion.Borders(xlEdgeTop)
                    .LineStyle = xlContinuous
                    .Weight = xlMedium
                    .Color = RGB(0, 0, 0)
                End With
                Set Selektion = Range(Range("\selected_additional_YesNo_Streik").Offset(2, 4), _
                    Range("\selected_additional_YesNo_Streik").Offset(2, 8))
                With Selektion.Borders(xlEdgeTop)
                    .LineStyle = xlContinuous
                    .Weight = xlMedium
                    .Color = RGB(0, 0, 0)
                End With
            End If

            Range("\selected_additional_YesNo_Streik").Offset(1, 2).ClearContents
            Range("\selected_additional_YesNo_Streik").Offset(1, 0).EntireRow.Hidden = True
            Range("\selected_additional_YesNo_Streik").Select
        End If
    End If
    Resume Raus5
Raus5:
    On Error GoTo 0

    ' -------------------------------------------------------------
    ' setzt Schreibschutz aufs Blatt oder hebt ihn auf, wenn der Range("\selected_status") geändert wird
    If Range("Change_Stop") = "x" Then
        Exit Sub
    End If
    On Error GoTo Raus6
    Resume Raus6
Raus6:
    On Error GoTo 0

End Sub
