; RotinaActivity Ultimate Inno Setup Installer Script
; Compatible with Inno Setup 6.x

[Setup]
AppId={{E891C021-9B5A-4E38-A29F-72C981442110}
AppName=RotinaActivity Ultimate
AppVersion=1.0.0
AppPublisher=Rotina Software Solutions
AppPublisherURL=https://www.rotinaactivity.com
AppSupportURL=https://www.rotinaactivity.com/support
AppUpdatesURL=https://www.rotinaactivity.com/updates
DefaultDirName={autopf}\RotinaActivity
DefaultGroupName=RotinaActivity Ultimate
AllowNoIcons=yes
OutputDir=Output
OutputBaseFilename=RotinaActivity_Setup
SetupIconFile=icon.ico
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
MinVersion=10.0
PrivilegesRequired=admin

[Languages]
Name: "portuguese"; MessagesFile: "compiler:Languages\Portuguese.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "autostartagent"; Description: "Iniciar Agente da Barra de Tarefas automaticamente com o Windows"; GroupDescription: "Inicialização:"

[Files]
Source: "publish_portable\RotinaActivity.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "publish_portable\RotinaActivityAgent.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "publish_portable\dist_ui\*"; DestDir: "{app}\dist_ui"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "icon.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "icon.png"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\RotinaActivity Ultimate"; Filename: "{app}\RotinaActivity.exe"
Name: "{group}\Agente da Barra de Tarefas"; Filename: "{app}\RotinaActivityAgent.exe"
Name: "{autodesktop}\RotinaActivity Ultimate"; Filename: "{app}\RotinaActivity.exe"; Tasks: desktopicon
Name: "{userstartup}\RotinaActivityAgent"; Filename: "{app}\RotinaActivityAgent.exe"; Tasks: autostartagent

[Run]
Filename: "{app}\RotinaActivityAgent.exe"; Description: "Iniciar Agente da Barra de Tarefas"; Flags: nowait postinstall skipifsilent
Filename: "{app}\RotinaActivity.exe"; Description: "{cm:LaunchProgram,RotinaActivity Ultimate}"; Flags: nowait postinstall skipifsilent
