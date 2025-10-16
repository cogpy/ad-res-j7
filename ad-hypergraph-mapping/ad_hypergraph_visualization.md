# AD Hypergraph Visualization

```mermaid
graph TB
    cogpy/ad-res-j7_authorization["authorization components in cogpy/ad-res-j7<br/>(3434 components)"]
    style cogpy/ad-res-j7_authorization fill:#99ff99
    cogpy/ad-res-j7_identity["identity components in cogpy/ad-res-j7<br/>(1930 components)"]
    style cogpy/ad-res-j7_identity fill:#9999ff
    cogpy/ad-res-j7_directory["directory components in cogpy/ad-res-j7<br/>(3835 components)"]
    style cogpy/ad-res-j7_directory fill:#ff99ff
    cogpy/ad-res-j7_security["security components in cogpy/ad-res-j7<br/>(801 components)"]
    style cogpy/ad-res-j7_security fill:#ffcc99
    cogpy/ad-res-j7_authentication["authentication components in cogpy/ad-res-j7<br/>(1720 components)"]
    style cogpy/ad-res-j7_authentication fill:#ff9999
    cogpy/ad-res-j7_token["token components in cogpy/ad-res-j7<br/>(81 components)"]
    style cogpy/ad-res-j7_token fill:#ffff99
    cogpy/ad-res-j7_sso["sso components in cogpy/ad-res-j7<br/>(36 components)"]
    style cogpy/ad-res-j7_sso fill:#99ffff
    cogpy/ad-res-j7_api_auth["api_auth components in cogpy/ad-res-j7<br/>(18 components)"]
    style cogpy/ad-res-j7_api_auth fill:#cc99ff
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_2(("co_occurrence"))
    style conn_edge_2 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_sso --- conn_edge_2
    cogpy/ad-res-j7_identity --- conn_edge_2
    cogpy/ad-res-j7_directory --- conn_edge_2
    cogpy/ad-res-j7_security --- conn_edge_2
    cogpy/ad-res-j7_api_auth --- conn_edge_2
    cogpy/ad-res-j7_authentication --- conn_edge_2
    cogpy/ad-res-j7_token --- conn_edge_2
    cogpy/ad-res-j7_authorization --- conn_edge_2
    conn_edge_3(("co_occurrence"))
    style conn_edge_3 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_3
    cogpy/ad-res-j7_directory --- conn_edge_3
    cogpy/ad-res-j7_authentication --- conn_edge_3
    conn_edge_4(("co_occurrence"))
    style conn_edge_4 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_4
    cogpy/ad-res-j7_directory --- conn_edge_4
    cogpy/ad-res-j7_authentication --- conn_edge_4
    conn_edge_5(("co_occurrence"))
    style conn_edge_5 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_5
    cogpy/ad-res-j7_directory --- conn_edge_5
    cogpy/ad-res-j7_authentication --- conn_edge_5
    cogpy/ad-res-j7_security --- conn_edge_5
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_7(("co_occurrence"))
    style conn_edge_7 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_7
    cogpy/ad-res-j7_identity --- conn_edge_7
    cogpy/ad-res-j7_directory --- conn_edge_7
    cogpy/ad-res-j7_authentication --- conn_edge_7
    conn_edge_8(("co_occurrence"))
    style conn_edge_8 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_sso --- conn_edge_8
    cogpy/ad-res-j7_identity --- conn_edge_8
    cogpy/ad-res-j7_directory --- conn_edge_8
    cogpy/ad-res-j7_security --- conn_edge_8
    cogpy/ad-res-j7_api_auth --- conn_edge_8
    cogpy/ad-res-j7_authentication --- conn_edge_8
    cogpy/ad-res-j7_token --- conn_edge_8
    cogpy/ad-res-j7_authorization --- conn_edge_8
    conn_edge_9(("co_occurrence"))
    style conn_edge_9 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_9
    cogpy/ad-res-j7_identity --- conn_edge_9
    cogpy/ad-res-j7_authentication --- conn_edge_9
    cogpy/ad-res-j7_security --- conn_edge_9
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_11(("co_occurrence"))
    style conn_edge_11 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_11
    cogpy/ad-res-j7_authentication --- conn_edge_11
    cogpy/ad-res-j7_security --- conn_edge_11
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_13(("co_occurrence"))
    style conn_edge_13 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_13
    cogpy/ad-res-j7_authentication --- conn_edge_13
    cogpy/ad-res-j7_security --- conn_edge_13
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_15(("co_occurrence"))
    style conn_edge_15 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_15
    cogpy/ad-res-j7_directory --- conn_edge_15
    cogpy/ad-res-j7_authentication --- conn_edge_15
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_17(("co_occurrence"))
    style conn_edge_17 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_17
    cogpy/ad-res-j7_authentication --- conn_edge_17
    cogpy/ad-res-j7_security --- conn_edge_17
    conn_edge_18(("co_occurrence"))
    style conn_edge_18 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_18
    cogpy/ad-res-j7_token --- conn_edge_18
    cogpy/ad-res-j7_security --- conn_edge_18
    conn_edge_19(("co_occurrence"))
    style conn_edge_19 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_19
    cogpy/ad-res-j7_identity --- conn_edge_19
    cogpy/ad-res-j7_authentication --- conn_edge_19
    conn_edge_20(("co_occurrence"))
    style conn_edge_20 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_20
    cogpy/ad-res-j7_identity --- conn_edge_20
    cogpy/ad-res-j7_authentication --- conn_edge_20
    cogpy/ad-res-j7_security --- conn_edge_20
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_23(("co_occurrence"))
    style conn_edge_23 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_23
    cogpy/ad-res-j7_authentication --- conn_edge_23
    cogpy/ad-res-j7_token --- conn_edge_23
    cogpy/ad-res-j7_security --- conn_edge_23
    conn_edge_24(("co_occurrence"))
    style conn_edge_24 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_24
    cogpy/ad-res-j7_identity --- conn_edge_24
    cogpy/ad-res-j7_authentication --- conn_edge_24
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_26(("co_occurrence"))
    style conn_edge_26 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_26
    cogpy/ad-res-j7_identity --- conn_edge_26
    cogpy/ad-res-j7_directory --- conn_edge_26
    cogpy/ad-res-j7_authentication --- conn_edge_26
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_28(("co_occurrence"))
    style conn_edge_28 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_28
    cogpy/ad-res-j7_directory --- conn_edge_28
    cogpy/ad-res-j7_authentication --- conn_edge_28
    conn_edge_29(("co_occurrence"))
    style conn_edge_29 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_29
    cogpy/ad-res-j7_directory --- conn_edge_29
    cogpy/ad-res-j7_authentication --- conn_edge_29
    conn_edge_30(("co_occurrence"))
    style conn_edge_30 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_directory --- conn_edge_30
    cogpy/ad-res-j7_authentication --- conn_edge_30
    cogpy/ad-res-j7_security --- conn_edge_30
    conn_edge_31(("co_occurrence"))
    style conn_edge_31 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_31
    cogpy/ad-res-j7_directory --- conn_edge_31
    cogpy/ad-res-j7_security --- conn_edge_31
    cogpy/ad-res-j7_authentication --- conn_edge_31
    cogpy/ad-res-j7_authorization --- conn_edge_31
    conn_edge_32(("co_occurrence"))
    style conn_edge_32 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_32
    cogpy/ad-res-j7_directory --- conn_edge_32
    cogpy/ad-res-j7_security --- conn_edge_32
    conn_edge_33(("co_occurrence"))
    style conn_edge_33 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_sso --- conn_edge_33
    cogpy/ad-res-j7_identity --- conn_edge_33
    cogpy/ad-res-j7_directory --- conn_edge_33
    cogpy/ad-res-j7_security --- conn_edge_33
    cogpy/ad-res-j7_api_auth --- conn_edge_33
    cogpy/ad-res-j7_authentication --- conn_edge_33
    cogpy/ad-res-j7_token --- conn_edge_33
    cogpy/ad-res-j7_authorization --- conn_edge_33
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_35(("co_occurrence"))
    style conn_edge_35 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_35
    cogpy/ad-res-j7_identity --- conn_edge_35
    cogpy/ad-res-j7_directory --- conn_edge_35
    cogpy/ad-res-j7_authentication --- conn_edge_35
    conn_edge_36(("co_occurrence"))
    style conn_edge_36 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_36
    cogpy/ad-res-j7_directory --- conn_edge_36
    cogpy/ad-res-j7_security --- conn_edge_36
    cogpy/ad-res-j7_authentication --- conn_edge_36
    cogpy/ad-res-j7_authorization --- conn_edge_36
    conn_edge_37(("co_occurrence"))
    style conn_edge_37 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_37
    cogpy/ad-res-j7_directory --- conn_edge_37
    cogpy/ad-res-j7_security --- conn_edge_37
    cogpy/ad-res-j7_authentication --- conn_edge_37
    cogpy/ad-res-j7_authorization --- conn_edge_37
    conn_edge_38(("co_occurrence"))
    style conn_edge_38 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_38
    cogpy/ad-res-j7_identity --- conn_edge_38
    cogpy/ad-res-j7_directory --- conn_edge_38
    cogpy/ad-res-j7_authentication --- conn_edge_38
    conn_edge_39(("co_occurrence"))
    style conn_edge_39 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_39
    cogpy/ad-res-j7_directory --- conn_edge_39
    cogpy/ad-res-j7_security --- conn_edge_39
    cogpy/ad-res-j7_authentication --- conn_edge_39
    cogpy/ad-res-j7_authorization --- conn_edge_39
    conn_edge_40(("co_occurrence"))
    style conn_edge_40 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_40
    cogpy/ad-res-j7_directory --- conn_edge_40
    cogpy/ad-res-j7_security --- conn_edge_40
    cogpy/ad-res-j7_authentication --- conn_edge_40
    cogpy/ad-res-j7_authorization --- conn_edge_40
    conn_edge_41(("co_occurrence"))
    style conn_edge_41 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_41
    cogpy/ad-res-j7_directory --- conn_edge_41
    cogpy/ad-res-j7_authentication --- conn_edge_41
    cogpy/ad-res-j7_security --- conn_edge_41
    conn_edge_42(("co_occurrence"))
    style conn_edge_42 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_42
    cogpy/ad-res-j7_identity --- conn_edge_42
    cogpy/ad-res-j7_directory --- conn_edge_42
    cogpy/ad-res-j7_authentication --- conn_edge_42
    conn_edge_43(("co_occurrence"))
    style conn_edge_43 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_43
    cogpy/ad-res-j7_identity --- conn_edge_43
    cogpy/ad-res-j7_directory --- conn_edge_43
    cogpy/ad-res-j7_authentication --- conn_edge_43
    conn_edge_44(("co_occurrence"))
    style conn_edge_44 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_44
    cogpy/ad-res-j7_directory --- conn_edge_44
    cogpy/ad-res-j7_security --- conn_edge_44
    cogpy/ad-res-j7_authentication --- conn_edge_44
    cogpy/ad-res-j7_authorization --- conn_edge_44
    conn_edge_45(("co_occurrence"))
    style conn_edge_45 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_45
    cogpy/ad-res-j7_identity --- conn_edge_45
    cogpy/ad-res-j7_directory --- conn_edge_45
    cogpy/ad-res-j7_authentication --- conn_edge_45
    conn_edge_46(("co_occurrence"))
    style conn_edge_46 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_directory --- conn_edge_46
    cogpy/ad-res-j7_authentication --- conn_edge_46
    cogpy/ad-res-j7_security --- conn_edge_46
    conn_edge_47(("co_occurrence"))
    style conn_edge_47 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_47
    cogpy/ad-res-j7_directory --- conn_edge_47
    cogpy/ad-res-j7_security --- conn_edge_47
    cogpy/ad-res-j7_authentication --- conn_edge_47
    cogpy/ad-res-j7_authorization --- conn_edge_47
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_49(("co_occurrence"))
    style conn_edge_49 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_49
    cogpy/ad-res-j7_identity --- conn_edge_49
    cogpy/ad-res-j7_directory --- conn_edge_49
    cogpy/ad-res-j7_authentication --- conn_edge_49
    conn_edge_50(("co_occurrence"))
    style conn_edge_50 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_50
    cogpy/ad-res-j7_directory --- conn_edge_50
    cogpy/ad-res-j7_authentication --- conn_edge_50
    conn_edge_51(("co_occurrence"))
    style conn_edge_51 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_51
    cogpy/ad-res-j7_directory --- conn_edge_51
    cogpy/ad-res-j7_security --- conn_edge_51
    cogpy/ad-res-j7_authentication --- conn_edge_51
    cogpy/ad-res-j7_authorization --- conn_edge_51
    conn_edge_52(("co_occurrence"))
    style conn_edge_52 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_52
    cogpy/ad-res-j7_directory --- conn_edge_52
    cogpy/ad-res-j7_authentication --- conn_edge_52
    conn_edge_53(("co_occurrence"))
    style conn_edge_53 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_53
    cogpy/ad-res-j7_directory --- conn_edge_53
    cogpy/ad-res-j7_security --- conn_edge_53
    cogpy/ad-res-j7_authentication --- conn_edge_53
    cogpy/ad-res-j7_authorization --- conn_edge_53
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_55(("co_occurrence"))
    style conn_edge_55 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_55
    cogpy/ad-res-j7_directory --- conn_edge_55
    cogpy/ad-res-j7_security --- conn_edge_55
    cogpy/ad-res-j7_authentication --- conn_edge_55
    cogpy/ad-res-j7_authorization --- conn_edge_55
    conn_edge_56(("co_occurrence"))
    style conn_edge_56 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_56
    cogpy/ad-res-j7_directory --- conn_edge_56
    cogpy/ad-res-j7_security --- conn_edge_56
    cogpy/ad-res-j7_authentication --- conn_edge_56
    cogpy/ad-res-j7_authorization --- conn_edge_56
    conn_edge_57(("co_occurrence"))
    style conn_edge_57 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_57
    cogpy/ad-res-j7_directory --- conn_edge_57
    cogpy/ad-res-j7_security --- conn_edge_57
    cogpy/ad-res-j7_authentication --- conn_edge_57
    cogpy/ad-res-j7_authorization --- conn_edge_57
    conn_edge_58(("co_occurrence"))
    style conn_edge_58 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_58
    cogpy/ad-res-j7_directory --- conn_edge_58
    cogpy/ad-res-j7_security --- conn_edge_58
    cogpy/ad-res-j7_authentication --- conn_edge_58
    cogpy/ad-res-j7_authorization --- conn_edge_58
    conn_edge_59(("co_occurrence"))
    style conn_edge_59 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_59
    cogpy/ad-res-j7_identity --- conn_edge_59
    cogpy/ad-res-j7_directory --- conn_edge_59
    cogpy/ad-res-j7_authentication --- conn_edge_59
    conn_edge_60(("co_occurrence"))
    style conn_edge_60 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_60
    cogpy/ad-res-j7_directory --- conn_edge_60
    cogpy/ad-res-j7_security --- conn_edge_60
    cogpy/ad-res-j7_authentication --- conn_edge_60
    cogpy/ad-res-j7_authorization --- conn_edge_60
    conn_edge_61(("co_occurrence"))
    style conn_edge_61 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_61
    cogpy/ad-res-j7_identity --- conn_edge_61
    cogpy/ad-res-j7_authentication --- conn_edge_61
    conn_edge_62(("co_occurrence"))
    style conn_edge_62 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_62
    cogpy/ad-res-j7_identity --- conn_edge_62
    cogpy/ad-res-j7_directory --- conn_edge_62
    cogpy/ad-res-j7_authentication --- conn_edge_62
    conn_edge_63(("co_occurrence"))
    style conn_edge_63 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_63
    cogpy/ad-res-j7_directory --- conn_edge_63
    cogpy/ad-res-j7_security --- conn_edge_63
    cogpy/ad-res-j7_authentication --- conn_edge_63
    cogpy/ad-res-j7_authorization --- conn_edge_63
    conn_edge_64(("co_occurrence"))
    style conn_edge_64 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_64
    cogpy/ad-res-j7_directory --- conn_edge_64
    cogpy/ad-res-j7_authentication --- conn_edge_64
    conn_edge_65(("co_occurrence"))
    style conn_edge_65 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_65
    cogpy/ad-res-j7_identity --- conn_edge_65
    cogpy/ad-res-j7_directory --- conn_edge_65
    cogpy/ad-res-j7_authentication --- conn_edge_65
    conn_edge_66(("co_occurrence"))
    style conn_edge_66 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_66
    cogpy/ad-res-j7_identity --- conn_edge_66
    cogpy/ad-res-j7_directory --- conn_edge_66
    cogpy/ad-res-j7_authentication --- conn_edge_66
    conn_edge_67(("co_occurrence"))
    style conn_edge_67 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_67
    cogpy/ad-res-j7_identity --- conn_edge_67
    cogpy/ad-res-j7_directory --- conn_edge_67
    conn_edge_68(("co_occurrence"))
    style conn_edge_68 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_68
    cogpy/ad-res-j7_identity --- conn_edge_68
    cogpy/ad-res-j7_directory --- conn_edge_68
    conn_edge_69(("co_occurrence"))
    style conn_edge_69 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_69
    cogpy/ad-res-j7_identity --- conn_edge_69
    cogpy/ad-res-j7_directory --- conn_edge_69
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_71(("co_occurrence"))
    style conn_edge_71 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_71
    cogpy/ad-res-j7_identity --- conn_edge_71
    cogpy/ad-res-j7_directory --- conn_edge_71
    conn_edge_72(("co_occurrence"))
    style conn_edge_72 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_72
    cogpy/ad-res-j7_identity --- conn_edge_72
    cogpy/ad-res-j7_directory --- conn_edge_72
    conn_edge_73(("co_occurrence"))
    style conn_edge_73 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_73
    cogpy/ad-res-j7_directory --- conn_edge_73
    cogpy/ad-res-j7_security --- conn_edge_73
    cogpy/ad-res-j7_authentication --- conn_edge_73
    cogpy/ad-res-j7_authorization --- conn_edge_73
    conn_edge_74(("co_occurrence"))
    style conn_edge_74 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_74
    cogpy/ad-res-j7_identity --- conn_edge_74
    cogpy/ad-res-j7_directory --- conn_edge_74
    cogpy/ad-res-j7_authentication --- conn_edge_74
    conn_edge_75(("co_occurrence"))
    style conn_edge_75 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_75
    cogpy/ad-res-j7_directory --- conn_edge_75
    cogpy/ad-res-j7_authentication --- conn_edge_75
    cogpy/ad-res-j7_security --- conn_edge_75
    conn_edge_76(("co_occurrence"))
    style conn_edge_76 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_76
    cogpy/ad-res-j7_identity --- conn_edge_76
    cogpy/ad-res-j7_directory --- conn_edge_76
    cogpy/ad-res-j7_authentication --- conn_edge_76
    conn_edge_77(("co_occurrence"))
    style conn_edge_77 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_77
    cogpy/ad-res-j7_directory --- conn_edge_77
    cogpy/ad-res-j7_security --- conn_edge_77
    cogpy/ad-res-j7_authentication --- conn_edge_77
    cogpy/ad-res-j7_authorization --- conn_edge_77
    conn_edge_78(("co_occurrence"))
    style conn_edge_78 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_78
    cogpy/ad-res-j7_identity --- conn_edge_78
    cogpy/ad-res-j7_directory --- conn_edge_78
    cogpy/ad-res-j7_authentication --- conn_edge_78
    conn_edge_79(("co_occurrence"))
    style conn_edge_79 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_79
    cogpy/ad-res-j7_directory --- conn_edge_79
    cogpy/ad-res-j7_security --- conn_edge_79
    cogpy/ad-res-j7_authentication --- conn_edge_79
    cogpy/ad-res-j7_authorization --- conn_edge_79
    conn_edge_80(("co_occurrence"))
    style conn_edge_80 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_80
    cogpy/ad-res-j7_identity --- conn_edge_80
    cogpy/ad-res-j7_directory --- conn_edge_80
    conn_edge_81(("co_occurrence"))
    style conn_edge_81 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_81
    cogpy/ad-res-j7_identity --- conn_edge_81
    cogpy/ad-res-j7_directory --- conn_edge_81
    cogpy/ad-res-j7_authentication --- conn_edge_81
    conn_edge_82(("co_occurrence"))
    style conn_edge_82 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_82
    cogpy/ad-res-j7_identity --- conn_edge_82
    cogpy/ad-res-j7_directory --- conn_edge_82
    cogpy/ad-res-j7_authentication --- conn_edge_82
    conn_edge_83(("co_occurrence"))
    style conn_edge_83 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_83
    cogpy/ad-res-j7_identity --- conn_edge_83
    cogpy/ad-res-j7_directory --- conn_edge_83
    cogpy/ad-res-j7_authentication --- conn_edge_83
    conn_edge_84(("co_occurrence"))
    style conn_edge_84 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_84
    cogpy/ad-res-j7_directory --- conn_edge_84
    cogpy/ad-res-j7_authentication --- conn_edge_84
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_directory
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_87(("co_occurrence"))
    style conn_edge_87 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_87
    cogpy/ad-res-j7_directory --- conn_edge_87
    cogpy/ad-res-j7_authentication --- conn_edge_87
    conn_edge_88(("co_occurrence"))
    style conn_edge_88 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_88
    cogpy/ad-res-j7_directory --- conn_edge_88
    cogpy/ad-res-j7_security --- conn_edge_88
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    conn_edge_90(("co_occurrence"))
    style conn_edge_90 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_directory --- conn_edge_90
    cogpy/ad-res-j7_token --- conn_edge_90
    cogpy/ad-res-j7_security --- conn_edge_90
    conn_edge_91(("co_occurrence"))
    style conn_edge_91 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_91
    cogpy/ad-res-j7_identity --- conn_edge_91
    cogpy/ad-res-j7_directory --- conn_edge_91
    cogpy/ad-res-j7_authentication --- conn_edge_91
    conn_edge_92(("co_occurrence"))
    style conn_edge_92 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_92
    cogpy/ad-res-j7_security --- conn_edge_92
    cogpy/ad-res-j7_authentication --- conn_edge_92
    cogpy/ad-res-j7_token --- conn_edge_92
    cogpy/ad-res-j7_authorization --- conn_edge_92
    conn_edge_93(("co_occurrence"))
    style conn_edge_93 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_93
    cogpy/ad-res-j7_directory --- conn_edge_93
    cogpy/ad-res-j7_authentication --- conn_edge_93
    cogpy/ad-res-j7_security --- conn_edge_93
    conn_edge_94(("co_occurrence"))
    style conn_edge_94 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_94
    cogpy/ad-res-j7_directory --- conn_edge_94
    cogpy/ad-res-j7_security --- conn_edge_94
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_99(("co_occurrence"))
    style conn_edge_99 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_99
    cogpy/ad-res-j7_authentication --- conn_edge_99
    cogpy/ad-res-j7_security --- conn_edge_99
    conn_edge_100(("co_occurrence"))
    style conn_edge_100 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authentication --- conn_edge_100
    cogpy/ad-res-j7_token --- conn_edge_100
    cogpy/ad-res-j7_security --- conn_edge_100
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_102(("co_occurrence"))
    style conn_edge_102 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_102
    cogpy/ad-res-j7_identity --- conn_edge_102
    cogpy/ad-res-j7_security --- conn_edge_102
    conn_edge_103(("co_occurrence"))
    style conn_edge_103 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_103
    cogpy/ad-res-j7_directory --- conn_edge_103
    cogpy/ad-res-j7_authentication --- conn_edge_103
    cogpy/ad-res-j7_security --- conn_edge_103
    conn_edge_104(("co_occurrence"))
    style conn_edge_104 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_104
    cogpy/ad-res-j7_token --- conn_edge_104
    cogpy/ad-res-j7_security --- conn_edge_104
    conn_edge_105(("co_occurrence"))
    style conn_edge_105 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_105
    cogpy/ad-res-j7_directory --- conn_edge_105
    cogpy/ad-res-j7_security --- conn_edge_105
    cogpy/ad-res-j7_authentication --- conn_edge_105
    cogpy/ad-res-j7_authorization --- conn_edge_105
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_authentication -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_110(("co_occurrence"))
    style conn_edge_110 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_110
    cogpy/ad-res-j7_directory --- conn_edge_110
    cogpy/ad-res-j7_security --- conn_edge_110
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_112(("co_occurrence"))
    style conn_edge_112 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_112
    cogpy/ad-res-j7_directory --- conn_edge_112
    cogpy/ad-res-j7_security --- conn_edge_112
    cogpy/ad-res-j7_authentication --- conn_edge_112
    cogpy/ad-res-j7_authorization --- conn_edge_112
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_114(("co_occurrence"))
    style conn_edge_114 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_114
    cogpy/ad-res-j7_directory --- conn_edge_114
    cogpy/ad-res-j7_security --- conn_edge_114
    cogpy/ad-res-j7_authentication --- conn_edge_114
    cogpy/ad-res-j7_authorization --- conn_edge_114
    conn_edge_115(("co_occurrence"))
    style conn_edge_115 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_115
    cogpy/ad-res-j7_identity --- conn_edge_115
    cogpy/ad-res-j7_authentication --- conn_edge_115
    cogpy/ad-res-j7_security --- conn_edge_115
    conn_edge_116(("co_occurrence"))
    style conn_edge_116 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_116
    cogpy/ad-res-j7_directory --- conn_edge_116
    cogpy/ad-res-j7_security --- conn_edge_116
    cogpy/ad-res-j7_api_auth --- conn_edge_116
    cogpy/ad-res-j7_authentication --- conn_edge_116
    cogpy/ad-res-j7_token --- conn_edge_116
    cogpy/ad-res-j7_authorization --- conn_edge_116
    conn_edge_117(("co_occurrence"))
    style conn_edge_117 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_117
    cogpy/ad-res-j7_directory --- conn_edge_117
    cogpy/ad-res-j7_authentication --- conn_edge_117
    cogpy/ad-res-j7_security --- conn_edge_117
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_119(("co_occurrence"))
    style conn_edge_119 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_119
    cogpy/ad-res-j7_directory --- conn_edge_119
    cogpy/ad-res-j7_authentication --- conn_edge_119
    cogpy/ad-res-j7_security --- conn_edge_119
    conn_edge_120(("co_occurrence"))
    style conn_edge_120 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_120
    cogpy/ad-res-j7_security --- conn_edge_120
    cogpy/ad-res-j7_authentication --- conn_edge_120
    cogpy/ad-res-j7_token --- conn_edge_120
    cogpy/ad-res-j7_authorization --- conn_edge_120
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_122(("co_occurrence"))
    style conn_edge_122 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_122
    cogpy/ad-res-j7_identity --- conn_edge_122
    cogpy/ad-res-j7_directory --- conn_edge_122
    cogpy/ad-res-j7_security --- conn_edge_122
    conn_edge_123(("co_occurrence"))
    style conn_edge_123 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_123
    cogpy/ad-res-j7_authentication --- conn_edge_123
    cogpy/ad-res-j7_security --- conn_edge_123
    conn_edge_124(("co_occurrence"))
    style conn_edge_124 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_124
    cogpy/ad-res-j7_identity --- conn_edge_124
    cogpy/ad-res-j7_directory --- conn_edge_124
    cogpy/ad-res-j7_security --- conn_edge_124
    conn_edge_125(("co_occurrence"))
    style conn_edge_125 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_125
    cogpy/ad-res-j7_directory --- conn_edge_125
    cogpy/ad-res-j7_security --- conn_edge_125
    conn_edge_126(("co_occurrence"))
    style conn_edge_126 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_126
    cogpy/ad-res-j7_directory --- conn_edge_126
    cogpy/ad-res-j7_security --- conn_edge_126
    cogpy/ad-res-j7_authentication --- conn_edge_126
    cogpy/ad-res-j7_authorization --- conn_edge_126
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_128(("co_occurrence"))
    style conn_edge_128 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_sso --- conn_edge_128
    cogpy/ad-res-j7_identity --- conn_edge_128
    cogpy/ad-res-j7_directory --- conn_edge_128
    cogpy/ad-res-j7_security --- conn_edge_128
    cogpy/ad-res-j7_api_auth --- conn_edge_128
    cogpy/ad-res-j7_authentication --- conn_edge_128
    cogpy/ad-res-j7_token --- conn_edge_128
    cogpy/ad-res-j7_authorization --- conn_edge_128
    conn_edge_129(("co_occurrence"))
    style conn_edge_129 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_sso --- conn_edge_129
    cogpy/ad-res-j7_identity --- conn_edge_129
    cogpy/ad-res-j7_directory --- conn_edge_129
    cogpy/ad-res-j7_security --- conn_edge_129
    cogpy/ad-res-j7_api_auth --- conn_edge_129
    cogpy/ad-res-j7_authentication --- conn_edge_129
    cogpy/ad-res-j7_token --- conn_edge_129
    cogpy/ad-res-j7_authorization --- conn_edge_129
    conn_edge_130(("co_occurrence"))
    style conn_edge_130 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_sso --- conn_edge_130
    cogpy/ad-res-j7_identity --- conn_edge_130
    cogpy/ad-res-j7_directory --- conn_edge_130
    cogpy/ad-res-j7_security --- conn_edge_130
    cogpy/ad-res-j7_api_auth --- conn_edge_130
    cogpy/ad-res-j7_authentication --- conn_edge_130
    cogpy/ad-res-j7_token --- conn_edge_130
    cogpy/ad-res-j7_authorization --- conn_edge_130
    conn_edge_131(("co_occurrence"))
    style conn_edge_131 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_131
    cogpy/ad-res-j7_directory --- conn_edge_131
    cogpy/ad-res-j7_security --- conn_edge_131
    cogpy/ad-res-j7_authentication --- conn_edge_131
    cogpy/ad-res-j7_authorization --- conn_edge_131
    conn_edge_132(("co_occurrence"))
    style conn_edge_132 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_132
    cogpy/ad-res-j7_identity --- conn_edge_132
    cogpy/ad-res-j7_authentication --- conn_edge_132
    cogpy/ad-res-j7_security --- conn_edge_132
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_135(("co_occurrence"))
    style conn_edge_135 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_135
    cogpy/ad-res-j7_directory --- conn_edge_135
    cogpy/ad-res-j7_security --- conn_edge_135
    cogpy/ad-res-j7_authentication --- conn_edge_135
    cogpy/ad-res-j7_authorization --- conn_edge_135
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_directory
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    conn_edge_138(("co_occurrence"))
    style conn_edge_138 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_138
    cogpy/ad-res-j7_directory --- conn_edge_138
    cogpy/ad-res-j7_security --- conn_edge_138
    cogpy/ad-res-j7_authentication --- conn_edge_138
    cogpy/ad-res-j7_authorization --- conn_edge_138
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_140(("co_occurrence"))
    style conn_edge_140 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_140
    cogpy/ad-res-j7_directory --- conn_edge_140
    cogpy/ad-res-j7_security --- conn_edge_140
    conn_edge_141(("co_occurrence"))
    style conn_edge_141 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_141
    cogpy/ad-res-j7_directory --- conn_edge_141
    cogpy/ad-res-j7_security --- conn_edge_141
    conn_edge_142(("co_occurrence"))
    style conn_edge_142 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_142
    cogpy/ad-res-j7_directory --- conn_edge_142
    cogpy/ad-res-j7_security --- conn_edge_142
    cogpy/ad-res-j7_authentication --- conn_edge_142
    cogpy/ad-res-j7_authorization --- conn_edge_142
    conn_edge_143(("co_occurrence"))
    style conn_edge_143 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_143
    cogpy/ad-res-j7_authentication --- conn_edge_143
    cogpy/ad-res-j7_token --- conn_edge_143
    cogpy/ad-res-j7_security --- conn_edge_143
    conn_edge_144(("co_occurrence"))
    style conn_edge_144 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_144
    cogpy/ad-res-j7_directory --- conn_edge_144
    cogpy/ad-res-j7_security --- conn_edge_144
    cogpy/ad-res-j7_token --- conn_edge_144
    cogpy/ad-res-j7_authorization --- conn_edge_144
    conn_edge_145(("co_occurrence"))
    style conn_edge_145 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_145
    cogpy/ad-res-j7_identity --- conn_edge_145
    cogpy/ad-res-j7_authentication --- conn_edge_145
    cogpy/ad-res-j7_security --- conn_edge_145
    conn_edge_146(("co_occurrence"))
    style conn_edge_146 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_146
    cogpy/ad-res-j7_directory --- conn_edge_146
    cogpy/ad-res-j7_security --- conn_edge_146
    cogpy/ad-res-j7_authentication --- conn_edge_146
    cogpy/ad-res-j7_token --- conn_edge_146
    cogpy/ad-res-j7_authorization --- conn_edge_146
    conn_edge_147(("co_occurrence"))
    style conn_edge_147 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_147
    cogpy/ad-res-j7_security --- conn_edge_147
    cogpy/ad-res-j7_authentication --- conn_edge_147
    cogpy/ad-res-j7_token --- conn_edge_147
    cogpy/ad-res-j7_authorization --- conn_edge_147
    conn_edge_148(("co_occurrence"))
    style conn_edge_148 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_148
    cogpy/ad-res-j7_directory --- conn_edge_148
    cogpy/ad-res-j7_token --- conn_edge_148
    cogpy/ad-res-j7_security --- conn_edge_148
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_151(("co_occurrence"))
    style conn_edge_151 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_151
    cogpy/ad-res-j7_identity --- conn_edge_151
    cogpy/ad-res-j7_security --- conn_edge_151
    conn_edge_152(("co_occurrence"))
    style conn_edge_152 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_152
    cogpy/ad-res-j7_identity --- conn_edge_152
    cogpy/ad-res-j7_authentication --- conn_edge_152
    cogpy/ad-res-j7_security --- conn_edge_152
    conn_edge_153(("co_occurrence"))
    style conn_edge_153 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_153
    cogpy/ad-res-j7_identity --- conn_edge_153
    cogpy/ad-res-j7_authentication --- conn_edge_153
    cogpy/ad-res-j7_security --- conn_edge_153
    conn_edge_154(("co_occurrence"))
    style conn_edge_154 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_154
    cogpy/ad-res-j7_directory --- conn_edge_154
    cogpy/ad-res-j7_security --- conn_edge_154
    conn_edge_155(("co_occurrence"))
    style conn_edge_155 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_155
    cogpy/ad-res-j7_identity --- conn_edge_155
    cogpy/ad-res-j7_directory --- conn_edge_155
    conn_edge_156(("co_occurrence"))
    style conn_edge_156 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_156
    cogpy/ad-res-j7_identity --- conn_edge_156
    cogpy/ad-res-j7_security --- conn_edge_156
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_authentication
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    conn_edge_159(("co_occurrence"))
    style conn_edge_159 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_159
    cogpy/ad-res-j7_identity --- conn_edge_159
    cogpy/ad-res-j7_authentication --- conn_edge_159
    cogpy/ad-res-j7_security --- conn_edge_159
    conn_edge_160(("co_occurrence"))
    style conn_edge_160 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_160
    cogpy/ad-res-j7_identity --- conn_edge_160
    cogpy/ad-res-j7_authentication --- conn_edge_160
    cogpy/ad-res-j7_security --- conn_edge_160
    conn_edge_161(("co_occurrence"))
    style conn_edge_161 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_161
    cogpy/ad-res-j7_identity --- conn_edge_161
    cogpy/ad-res-j7_authentication --- conn_edge_161
    cogpy/ad-res-j7_security --- conn_edge_161
    conn_edge_162(("co_occurrence"))
    style conn_edge_162 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_162
    cogpy/ad-res-j7_directory --- conn_edge_162
    cogpy/ad-res-j7_security --- conn_edge_162
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_164(("co_occurrence"))
    style conn_edge_164 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_164
    cogpy/ad-res-j7_identity --- conn_edge_164
    cogpy/ad-res-j7_directory --- conn_edge_164
    cogpy/ad-res-j7_authentication --- conn_edge_164
    conn_edge_165(("co_occurrence"))
    style conn_edge_165 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_165
    cogpy/ad-res-j7_identity --- conn_edge_165
    cogpy/ad-res-j7_directory --- conn_edge_165
    cogpy/ad-res-j7_authentication --- conn_edge_165
    conn_edge_166(("co_occurrence"))
    style conn_edge_166 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_166
    cogpy/ad-res-j7_identity --- conn_edge_166
    cogpy/ad-res-j7_directory --- conn_edge_166
    cogpy/ad-res-j7_authentication --- conn_edge_166
    conn_edge_167(("co_occurrence"))
    style conn_edge_167 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_167
    cogpy/ad-res-j7_identity --- conn_edge_167
    cogpy/ad-res-j7_authentication --- conn_edge_167
    cogpy/ad-res-j7_security --- conn_edge_167
    conn_edge_168(("co_occurrence"))
    style conn_edge_168 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_168
    cogpy/ad-res-j7_authentication --- conn_edge_168
    cogpy/ad-res-j7_security --- conn_edge_168
    conn_edge_169(("co_occurrence"))
    style conn_edge_169 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_169
    cogpy/ad-res-j7_identity --- conn_edge_169
    cogpy/ad-res-j7_authentication --- conn_edge_169
    cogpy/ad-res-j7_security --- conn_edge_169
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_171(("co_occurrence"))
    style conn_edge_171 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_171
    cogpy/ad-res-j7_directory --- conn_edge_171
    cogpy/ad-res-j7_security --- conn_edge_171
    cogpy/ad-res-j7_authentication --- conn_edge_171
    cogpy/ad-res-j7_authorization --- conn_edge_171
    conn_edge_172(("co_occurrence"))
    style conn_edge_172 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_172
    cogpy/ad-res-j7_identity --- conn_edge_172
    cogpy/ad-res-j7_authentication --- conn_edge_172
    conn_edge_173(("co_occurrence"))
    style conn_edge_173 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_173
    cogpy/ad-res-j7_identity --- conn_edge_173
    cogpy/ad-res-j7_authentication --- conn_edge_173
    cogpy/ad-res-j7_security --- conn_edge_173
    conn_edge_174(("co_occurrence"))
    style conn_edge_174 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_174
    cogpy/ad-res-j7_directory --- conn_edge_174
    cogpy/ad-res-j7_security --- conn_edge_174
    cogpy/ad-res-j7_authentication --- conn_edge_174
    cogpy/ad-res-j7_authorization --- conn_edge_174
    cogpy/ad-res-j7_authentication -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_176(("co_occurrence"))
    style conn_edge_176 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_176
    cogpy/ad-res-j7_directory --- conn_edge_176
    cogpy/ad-res-j7_authentication --- conn_edge_176
    cogpy/ad-res-j7_security --- conn_edge_176
    conn_edge_177(("co_occurrence"))
    style conn_edge_177 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_177
    cogpy/ad-res-j7_identity --- conn_edge_177
    cogpy/ad-res-j7_authentication --- conn_edge_177
    cogpy/ad-res-j7_security --- conn_edge_177
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_directory
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_181(("co_occurrence"))
    style conn_edge_181 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_181
    cogpy/ad-res-j7_directory --- conn_edge_181
    cogpy/ad-res-j7_security --- conn_edge_181
    cogpy/ad-res-j7_authentication --- conn_edge_181
    cogpy/ad-res-j7_authorization --- conn_edge_181
    conn_edge_182(("co_occurrence"))
    style conn_edge_182 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_182
    cogpy/ad-res-j7_directory --- conn_edge_182
    cogpy/ad-res-j7_security --- conn_edge_182
    cogpy/ad-res-j7_authentication --- conn_edge_182
    cogpy/ad-res-j7_authorization --- conn_edge_182
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_184(("co_occurrence"))
    style conn_edge_184 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_184
    cogpy/ad-res-j7_identity --- conn_edge_184
    cogpy/ad-res-j7_authentication --- conn_edge_184
    conn_edge_185(("co_occurrence"))
    style conn_edge_185 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_185
    cogpy/ad-res-j7_directory --- conn_edge_185
    cogpy/ad-res-j7_authentication --- conn_edge_185
    cogpy/ad-res-j7_security --- conn_edge_185
    conn_edge_186(("co_occurrence"))
    style conn_edge_186 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_186
    cogpy/ad-res-j7_directory --- conn_edge_186
    cogpy/ad-res-j7_authentication --- conn_edge_186
    conn_edge_187(("co_occurrence"))
    style conn_edge_187 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_187
    cogpy/ad-res-j7_identity --- conn_edge_187
    cogpy/ad-res-j7_authentication --- conn_edge_187
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_189(("co_occurrence"))
    style conn_edge_189 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_189
    cogpy/ad-res-j7_identity --- conn_edge_189
    cogpy/ad-res-j7_directory --- conn_edge_189
    cogpy/ad-res-j7_authentication --- conn_edge_189
    conn_edge_190(("co_occurrence"))
    style conn_edge_190 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_190
    cogpy/ad-res-j7_directory --- conn_edge_190
    cogpy/ad-res-j7_security --- conn_edge_190
    cogpy/ad-res-j7_authentication --- conn_edge_190
    cogpy/ad-res-j7_authorization --- conn_edge_190
    conn_edge_191(("co_occurrence"))
    style conn_edge_191 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_191
    cogpy/ad-res-j7_directory --- conn_edge_191
    cogpy/ad-res-j7_security --- conn_edge_191
    cogpy/ad-res-j7_authentication --- conn_edge_191
    cogpy/ad-res-j7_authorization --- conn_edge_191
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_193(("co_occurrence"))
    style conn_edge_193 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_193
    cogpy/ad-res-j7_identity --- conn_edge_193
    cogpy/ad-res-j7_directory --- conn_edge_193
    cogpy/ad-res-j7_authentication --- conn_edge_193
    conn_edge_194(("co_occurrence"))
    style conn_edge_194 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_194
    cogpy/ad-res-j7_directory --- conn_edge_194
    cogpy/ad-res-j7_security --- conn_edge_194
    cogpy/ad-res-j7_authentication --- conn_edge_194
    cogpy/ad-res-j7_authorization --- conn_edge_194
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_197(("co_occurrence"))
    style conn_edge_197 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_197
    cogpy/ad-res-j7_identity --- conn_edge_197
    cogpy/ad-res-j7_authentication --- conn_edge_197
    conn_edge_198(("co_occurrence"))
    style conn_edge_198 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_198
    cogpy/ad-res-j7_identity --- conn_edge_198
    cogpy/ad-res-j7_authentication --- conn_edge_198
    cogpy/ad-res-j7_security --- conn_edge_198
    conn_edge_199(("co_occurrence"))
    style conn_edge_199 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_199
    cogpy/ad-res-j7_identity --- conn_edge_199
    cogpy/ad-res-j7_authentication --- conn_edge_199
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_202(("co_occurrence"))
    style conn_edge_202 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_202
    cogpy/ad-res-j7_authentication --- conn_edge_202
    cogpy/ad-res-j7_security --- conn_edge_202
    conn_edge_203(("co_occurrence"))
    style conn_edge_203 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_203
    cogpy/ad-res-j7_identity --- conn_edge_203
    cogpy/ad-res-j7_authentication --- conn_edge_203
    cogpy/ad-res-j7_security --- conn_edge_203
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_205(("co_occurrence"))
    style conn_edge_205 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_205
    cogpy/ad-res-j7_identity --- conn_edge_205
    cogpy/ad-res-j7_authentication --- conn_edge_205
    conn_edge_206(("co_occurrence"))
    style conn_edge_206 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_206
    cogpy/ad-res-j7_directory --- conn_edge_206
    cogpy/ad-res-j7_security --- conn_edge_206
    cogpy/ad-res-j7_authentication --- conn_edge_206
    cogpy/ad-res-j7_authorization --- conn_edge_206
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    conn_edge_209(("co_occurrence"))
    style conn_edge_209 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_209
    cogpy/ad-res-j7_security --- conn_edge_209
    cogpy/ad-res-j7_authentication --- conn_edge_209
    cogpy/ad-res-j7_token --- conn_edge_209
    cogpy/ad-res-j7_authorization --- conn_edge_209
    conn_edge_210(("co_occurrence"))
    style conn_edge_210 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_210
    cogpy/ad-res-j7_identity --- conn_edge_210
    cogpy/ad-res-j7_authentication --- conn_edge_210
    conn_edge_211(("co_occurrence"))
    style conn_edge_211 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_211
    cogpy/ad-res-j7_identity --- conn_edge_211
    cogpy/ad-res-j7_directory --- conn_edge_211
    cogpy/ad-res-j7_authentication --- conn_edge_211
    conn_edge_212(("co_occurrence"))
    style conn_edge_212 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_212
    cogpy/ad-res-j7_identity --- conn_edge_212
    cogpy/ad-res-j7_authentication --- conn_edge_212
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    conn_edge_214(("co_occurrence"))
    style conn_edge_214 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_214
    cogpy/ad-res-j7_identity --- conn_edge_214
    cogpy/ad-res-j7_authentication --- conn_edge_214
    conn_edge_215(("co_occurrence"))
    style conn_edge_215 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_215
    cogpy/ad-res-j7_identity --- conn_edge_215
    cogpy/ad-res-j7_authentication --- conn_edge_215
    cogpy/ad-res-j7_security --- conn_edge_215
    conn_edge_216(("co_occurrence"))
    style conn_edge_216 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_216
    cogpy/ad-res-j7_identity --- conn_edge_216
    cogpy/ad-res-j7_authentication --- conn_edge_216
    conn_edge_217(("co_occurrence"))
    style conn_edge_217 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_217
    cogpy/ad-res-j7_identity --- conn_edge_217
    cogpy/ad-res-j7_authentication --- conn_edge_217
    cogpy/ad-res-j7_security --- conn_edge_217
    conn_edge_218(("co_occurrence"))
    style conn_edge_218 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_218
    cogpy/ad-res-j7_identity --- conn_edge_218
    cogpy/ad-res-j7_authentication --- conn_edge_218
    cogpy/ad-res-j7_security --- conn_edge_218
    conn_edge_219(("co_occurrence"))
    style conn_edge_219 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_219
    cogpy/ad-res-j7_identity --- conn_edge_219
    cogpy/ad-res-j7_authentication --- conn_edge_219
    conn_edge_220(("co_occurrence"))
    style conn_edge_220 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_220
    cogpy/ad-res-j7_identity --- conn_edge_220
    cogpy/ad-res-j7_authentication --- conn_edge_220
    cogpy/ad-res-j7_security --- conn_edge_220
    conn_edge_221(("co_occurrence"))
    style conn_edge_221 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_221
    cogpy/ad-res-j7_identity --- conn_edge_221
    cogpy/ad-res-j7_authentication --- conn_edge_221
    conn_edge_222(("co_occurrence"))
    style conn_edge_222 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_222
    cogpy/ad-res-j7_identity --- conn_edge_222
    cogpy/ad-res-j7_authentication --- conn_edge_222
    cogpy/ad-res-j7_security --- conn_edge_222
    conn_edge_223(("co_occurrence"))
    style conn_edge_223 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_223
    cogpy/ad-res-j7_identity --- conn_edge_223
    cogpy/ad-res-j7_authentication --- conn_edge_223
    conn_edge_224(("co_occurrence"))
    style conn_edge_224 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_224
    cogpy/ad-res-j7_identity --- conn_edge_224
    cogpy/ad-res-j7_authentication --- conn_edge_224
    conn_edge_225(("co_occurrence"))
    style conn_edge_225 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_225
    cogpy/ad-res-j7_identity --- conn_edge_225
    cogpy/ad-res-j7_authentication --- conn_edge_225
    conn_edge_226(("co_occurrence"))
    style conn_edge_226 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_226
    cogpy/ad-res-j7_identity --- conn_edge_226
    cogpy/ad-res-j7_authentication --- conn_edge_226
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_228(("co_occurrence"))
    style conn_edge_228 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_228
    cogpy/ad-res-j7_directory --- conn_edge_228
    cogpy/ad-res-j7_security --- conn_edge_228
    cogpy/ad-res-j7_authentication --- conn_edge_228
    cogpy/ad-res-j7_authorization --- conn_edge_228
    conn_edge_229(("co_occurrence"))
    style conn_edge_229 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_229
    cogpy/ad-res-j7_directory --- conn_edge_229
    cogpy/ad-res-j7_authentication --- conn_edge_229
    conn_edge_230(("co_occurrence"))
    style conn_edge_230 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_230
    cogpy/ad-res-j7_directory --- conn_edge_230
    cogpy/ad-res-j7_security --- conn_edge_230
    cogpy/ad-res-j7_authentication --- conn_edge_230
    cogpy/ad-res-j7_token --- conn_edge_230
    cogpy/ad-res-j7_authorization --- conn_edge_230
    conn_edge_231(("co_occurrence"))
    style conn_edge_231 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_231
    cogpy/ad-res-j7_identity --- conn_edge_231
    cogpy/ad-res-j7_directory --- conn_edge_231
    cogpy/ad-res-j7_authentication --- conn_edge_231
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_authentication
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_234(("co_occurrence"))
    style conn_edge_234 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_234
    cogpy/ad-res-j7_directory --- conn_edge_234
    cogpy/ad-res-j7_security --- conn_edge_234
    cogpy/ad-res-j7_authentication --- conn_edge_234
    cogpy/ad-res-j7_authorization --- conn_edge_234
    conn_edge_235(("co_occurrence"))
    style conn_edge_235 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_235
    cogpy/ad-res-j7_identity --- conn_edge_235
    cogpy/ad-res-j7_directory --- conn_edge_235
    cogpy/ad-res-j7_authentication --- conn_edge_235
    conn_edge_236(("co_occurrence"))
    style conn_edge_236 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_236
    cogpy/ad-res-j7_identity --- conn_edge_236
    cogpy/ad-res-j7_directory --- conn_edge_236
    cogpy/ad-res-j7_authentication --- conn_edge_236
    cogpy/ad-res-j7_directory -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_238(("co_occurrence"))
    style conn_edge_238 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_238
    cogpy/ad-res-j7_directory --- conn_edge_238
    cogpy/ad-res-j7_security --- conn_edge_238
    cogpy/ad-res-j7_authentication --- conn_edge_238
    cogpy/ad-res-j7_authorization --- conn_edge_238
    conn_edge_239(("co_occurrence"))
    style conn_edge_239 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_239
    cogpy/ad-res-j7_identity --- conn_edge_239
    cogpy/ad-res-j7_directory --- conn_edge_239
    cogpy/ad-res-j7_authentication --- conn_edge_239
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_241(("co_occurrence"))
    style conn_edge_241 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_sso --- conn_edge_241
    cogpy/ad-res-j7_identity --- conn_edge_241
    cogpy/ad-res-j7_security --- conn_edge_241
    cogpy/ad-res-j7_authentication --- conn_edge_241
    cogpy/ad-res-j7_token --- conn_edge_241
    cogpy/ad-res-j7_authorization --- conn_edge_241
    conn_edge_242(("co_occurrence"))
    style conn_edge_242 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_242
    cogpy/ad-res-j7_identity --- conn_edge_242
    cogpy/ad-res-j7_authentication --- conn_edge_242
    cogpy/ad-res-j7_security --- conn_edge_242
    conn_edge_243(("co_occurrence"))
    style conn_edge_243 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_243
    cogpy/ad-res-j7_identity --- conn_edge_243
    cogpy/ad-res-j7_authentication --- conn_edge_243
    cogpy/ad-res-j7_security --- conn_edge_243
    conn_edge_244(("co_occurrence"))
    style conn_edge_244 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_244
    cogpy/ad-res-j7_identity --- conn_edge_244
    cogpy/ad-res-j7_directory --- conn_edge_244
    cogpy/ad-res-j7_authentication --- conn_edge_244
    cogpy/ad-res-j7_authentication -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_246(("co_occurrence"))
    style conn_edge_246 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_246
    cogpy/ad-res-j7_identity --- conn_edge_246
    cogpy/ad-res-j7_authentication --- conn_edge_246
    cogpy/ad-res-j7_security --- conn_edge_246
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    conn_edge_248(("co_occurrence"))
    style conn_edge_248 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_sso --- conn_edge_248
    cogpy/ad-res-j7_identity --- conn_edge_248
    cogpy/ad-res-j7_security --- conn_edge_248
    cogpy/ad-res-j7_authentication --- conn_edge_248
    cogpy/ad-res-j7_token --- conn_edge_248
    cogpy/ad-res-j7_authorization --- conn_edge_248
    conn_edge_249(("co_occurrence"))
    style conn_edge_249 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_249
    cogpy/ad-res-j7_identity --- conn_edge_249
    cogpy/ad-res-j7_authentication --- conn_edge_249
    cogpy/ad-res-j7_security --- conn_edge_249
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    conn_edge_251(("co_occurrence"))
    style conn_edge_251 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_251
    cogpy/ad-res-j7_identity --- conn_edge_251
    cogpy/ad-res-j7_directory --- conn_edge_251
    cogpy/ad-res-j7_authentication --- conn_edge_251
    conn_edge_252(("co_occurrence"))
    style conn_edge_252 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_252
    cogpy/ad-res-j7_identity --- conn_edge_252
    cogpy/ad-res-j7_authentication --- conn_edge_252
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    conn_edge_254(("co_occurrence"))
    style conn_edge_254 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_254
    cogpy/ad-res-j7_identity --- conn_edge_254
    cogpy/ad-res-j7_authentication --- conn_edge_254
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_directory
    conn_edge_257(("co_occurrence"))
    style conn_edge_257 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_257
    cogpy/ad-res-j7_directory --- conn_edge_257
    cogpy/ad-res-j7_authentication --- conn_edge_257
    cogpy/ad-res-j7_security --- conn_edge_257
    conn_edge_258(("co_occurrence"))
    style conn_edge_258 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_258
    cogpy/ad-res-j7_security --- conn_edge_258
    cogpy/ad-res-j7_authentication --- conn_edge_258
    cogpy/ad-res-j7_token --- conn_edge_258
    cogpy/ad-res-j7_authorization --- conn_edge_258
    conn_edge_259(("co_occurrence"))
    style conn_edge_259 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_259
    cogpy/ad-res-j7_identity --- conn_edge_259
    cogpy/ad-res-j7_directory --- conn_edge_259
    conn_edge_260(("co_occurrence"))
    style conn_edge_260 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_260
    cogpy/ad-res-j7_identity --- conn_edge_260
    cogpy/ad-res-j7_directory --- conn_edge_260
    conn_edge_261(("co_occurrence"))
    style conn_edge_261 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_261
    cogpy/ad-res-j7_identity --- conn_edge_261
    cogpy/ad-res-j7_directory --- conn_edge_261
    conn_edge_262(("co_occurrence"))
    style conn_edge_262 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_262
    cogpy/ad-res-j7_directory --- conn_edge_262
    cogpy/ad-res-j7_security --- conn_edge_262
    cogpy/ad-res-j7_authentication --- conn_edge_262
    cogpy/ad-res-j7_authorization --- conn_edge_262
    conn_edge_263(("co_occurrence"))
    style conn_edge_263 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_263
    cogpy/ad-res-j7_identity --- conn_edge_263
    cogpy/ad-res-j7_directory --- conn_edge_263
    cogpy/ad-res-j7_security --- conn_edge_263
    conn_edge_264(("co_occurrence"))
    style conn_edge_264 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_264
    cogpy/ad-res-j7_identity --- conn_edge_264
    cogpy/ad-res-j7_authentication --- conn_edge_264
    conn_edge_265(("co_occurrence"))
    style conn_edge_265 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_265
    cogpy/ad-res-j7_identity --- conn_edge_265
    cogpy/ad-res-j7_authentication --- conn_edge_265
    conn_edge_266(("co_occurrence"))
    style conn_edge_266 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_266
    cogpy/ad-res-j7_identity --- conn_edge_266
    cogpy/ad-res-j7_authentication --- conn_edge_266
    conn_edge_267(("co_occurrence"))
    style conn_edge_267 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_267
    cogpy/ad-res-j7_identity --- conn_edge_267
    cogpy/ad-res-j7_authentication --- conn_edge_267
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_269(("co_occurrence"))
    style conn_edge_269 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_269
    cogpy/ad-res-j7_identity --- conn_edge_269
    cogpy/ad-res-j7_authentication --- conn_edge_269
    cogpy/ad-res-j7_security --- conn_edge_269
    conn_edge_270(("co_occurrence"))
    style conn_edge_270 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_270
    cogpy/ad-res-j7_identity --- conn_edge_270
    cogpy/ad-res-j7_authentication --- conn_edge_270
    cogpy/ad-res-j7_security --- conn_edge_270
    conn_edge_271(("co_occurrence"))
    style conn_edge_271 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_271
    cogpy/ad-res-j7_identity --- conn_edge_271
    cogpy/ad-res-j7_authentication --- conn_edge_271
    conn_edge_272(("co_occurrence"))
    style conn_edge_272 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_272
    cogpy/ad-res-j7_identity --- conn_edge_272
    cogpy/ad-res-j7_authentication --- conn_edge_272
    cogpy/ad-res-j7_security --- conn_edge_272
    conn_edge_273(("co_occurrence"))
    style conn_edge_273 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_273
    cogpy/ad-res-j7_identity --- conn_edge_273
    cogpy/ad-res-j7_authentication --- conn_edge_273
    conn_edge_274(("co_occurrence"))
    style conn_edge_274 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_274
    cogpy/ad-res-j7_identity --- conn_edge_274
    cogpy/ad-res-j7_authentication --- conn_edge_274
    cogpy/ad-res-j7_security --- conn_edge_274
    conn_edge_275(("co_occurrence"))
    style conn_edge_275 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_identity --- conn_edge_275
    cogpy/ad-res-j7_directory --- conn_edge_275
    cogpy/ad-res-j7_security --- conn_edge_275
    cogpy/ad-res-j7_authentication --- conn_edge_275
    cogpy/ad-res-j7_authorization --- conn_edge_275
    conn_edge_276(("co_occurrence"))
    style conn_edge_276 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_276
    cogpy/ad-res-j7_identity --- conn_edge_276
    cogpy/ad-res-j7_authentication --- conn_edge_276
    cogpy/ad-res-j7_security --- conn_edge_276
    cogpy/ad-res-j7_authentication -->|co occurrence| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_authentication -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_280(("co_occurrence"))
    style conn_edge_280 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_280
    cogpy/ad-res-j7_identity --- conn_edge_280
    cogpy/ad-res-j7_authentication --- conn_edge_280
    cogpy/ad-res-j7_security --- conn_edge_280
    cogpy/ad-res-j7_authentication -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_282(("co_occurrence"))
    style conn_edge_282 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_sso --- conn_edge_282
    cogpy/ad-res-j7_identity --- conn_edge_282
    cogpy/ad-res-j7_security --- conn_edge_282
    cogpy/ad-res-j7_authentication --- conn_edge_282
    cogpy/ad-res-j7_authorization --- conn_edge_282
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_directory
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_directory
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_security
    conn_edge_288(("co_occurrence"))
    style conn_edge_288 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_288
    cogpy/ad-res-j7_identity --- conn_edge_288
    cogpy/ad-res-j7_directory --- conn_edge_288
    cogpy/ad-res-j7_authentication --- conn_edge_288
    conn_edge_289(("co_occurrence"))
    style conn_edge_289 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_289
    cogpy/ad-res-j7_identity --- conn_edge_289
    cogpy/ad-res-j7_security --- conn_edge_289
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    conn_edge_291(("co_occurrence"))
    style conn_edge_291 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_291
    cogpy/ad-res-j7_identity --- conn_edge_291
    cogpy/ad-res-j7_security --- conn_edge_291
    conn_edge_292(("co_occurrence"))
    style conn_edge_292 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_292
    cogpy/ad-res-j7_identity --- conn_edge_292
    cogpy/ad-res-j7_directory --- conn_edge_292
    conn_edge_293(("co_occurrence"))
    style conn_edge_293 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_293
    cogpy/ad-res-j7_directory --- conn_edge_293
    cogpy/ad-res-j7_authentication --- conn_edge_293
    cogpy/ad-res-j7_security --- conn_edge_293
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    conn_edge_295(("co_occurrence"))
    style conn_edge_295 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_295
    cogpy/ad-res-j7_identity --- conn_edge_295
    cogpy/ad-res-j7_security --- conn_edge_295
    conn_edge_296(("co_occurrence"))
    style conn_edge_296 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_296
    cogpy/ad-res-j7_identity --- conn_edge_296
    cogpy/ad-res-j7_authentication --- conn_edge_296
    cogpy/ad-res-j7_security --- conn_edge_296
    cogpy/ad-res-j7_authentication -->|co occurrence| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_identity
    conn_edge_299(("co_occurrence"))
    style conn_edge_299 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_299
    cogpy/ad-res-j7_identity --- conn_edge_299
    cogpy/ad-res-j7_directory --- conn_edge_299
    cogpy/ad-res-j7_authentication --- conn_edge_299
    conn_edge_300(("co_occurrence"))
    style conn_edge_300 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_300
    cogpy/ad-res-j7_identity --- conn_edge_300
    cogpy/ad-res-j7_directory --- conn_edge_300
    cogpy/ad-res-j7_authentication --- conn_edge_300
    conn_edge_301(("co_occurrence"))
    style conn_edge_301 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_301
    cogpy/ad-res-j7_identity --- conn_edge_301
    cogpy/ad-res-j7_authentication --- conn_edge_301
    cogpy/ad-res-j7_authorization -->|co occurrence| cogpy/ad-res-j7_authentication
    conn_edge_303(("co_occurrence"))
    style conn_edge_303 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_303
    cogpy/ad-res-j7_identity --- conn_edge_303
    cogpy/ad-res-j7_authentication --- conn_edge_303
    cogpy/ad-res-j7_security --- conn_edge_303
    conn_edge_304(("co_occurrence"))
    style conn_edge_304 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_304
    cogpy/ad-res-j7_identity --- conn_edge_304
    cogpy/ad-res-j7_authentication --- conn_edge_304
    cogpy/ad-res-j7_security --- conn_edge_304
    conn_edge_305(("co_occurrence"))
    style conn_edge_305 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_305
    cogpy/ad-res-j7_identity --- conn_edge_305
    cogpy/ad-res-j7_security --- conn_edge_305
    conn_edge_306(("co_occurrence"))
    style conn_edge_306 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_306
    cogpy/ad-res-j7_identity --- conn_edge_306
    cogpy/ad-res-j7_authentication --- conn_edge_306
    cogpy/ad-res-j7_security --- conn_edge_306
    conn_edge_307(("co_occurrence"))
    style conn_edge_307 fill:#ffffff,stroke:#333333
    cogpy/ad-res-j7_authorization --- conn_edge_307
    cogpy/ad-res-j7_identity --- conn_edge_307
    cogpy/ad-res-j7_directory --- conn_edge_307
    cogpy/ad-res-j7_authentication --- conn_edge_307
    cogpy/ad-res-j7_identity -->|co occurrence| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_authentication -->|authenticates| cogpy/ad-res-j7_identity
    cogpy/ad-res-j7_authentication -->|generates| cogpy/ad-res-j7_token
    cogpy/ad-res-j7_identity -->|stored in| cogpy/ad-res-j7_directory
    cogpy/ad-res-j7_authentication -->|provides| cogpy/ad-res-j7_sso
    cogpy/ad-res-j7_token -->|used for| cogpy/ad-res-j7_api_auth
    cogpy/ad-res-j7_authentication -->|secures| cogpy/ad-res-j7_security
    cogpy/ad-res-j7_security -->|secures| cogpy/ad-res-j7_authorization
```

## Legend

- **Authentication** (Red): Login, credentials, authentication services
- **Authorization** (Green): Permissions, roles, access control
- **Identity** (Blue): User management, profiles, principals
- **Token** (Yellow): JWT, OAuth, session management
- **Directory** (Magenta): LDAP, Active Directory services
- **SSO** (Cyan): Single Sign-On implementations
- **Security** (Orange): Encryption, validation, security utilities
- **API Auth** (Purple): API keys, API authentication