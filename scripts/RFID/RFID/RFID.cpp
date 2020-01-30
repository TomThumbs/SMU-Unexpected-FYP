// RFID.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <windows.h>
#include "EPCDemoDll.h"
//#include <atlstr.h>
//#include <afxwin.h>

using namespace std;

int startCommunication(HANDLE *h_Com) {
    char comm[] = "COM3";
    OpenComm(h_Com, comm);
    //int test = OpenComm(h_Com, comm);
    //cout << test;
    if (h_Com != INVALID_HANDLE_VALUE) {
        cout << "Open the serial port successfully!" << endl;
    } else {
        cout << "Open the serial port for failure!" << endl;
    }

    return 0;
}

int readSoftwareV(HANDLE *h_Com) {
    int flag;
    char receive_data[2];
    flag = ReadSoftwareVersion(h_Com, receive_data);
    if (flag == 1) {
        cout << "Software Version is " << receive_data[0] << "." << receive_data[1] << endl;
    } else {
        cout << "Read Software Version Failed!" << endl;
    }

    return 0;
}

int resetR(HANDLE* h_Com) {
    int flag;
    flag = ResetReader(h_Com);
    if (flag == 1)
    {
        cout << "Reset readers successfully!" << endl;
    }
    else
    {
        cout << "Reset reader for failure!" << endl;
    }

    return 0;
}

int main()
{
    cout << "Hello World!\n";
    HANDLE serialHandle;

    serialHandle = CreateFile(L"COM3", GENERIC_READ | GENERIC_WRITE, 0, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0);
    startCommunication(&serialHandle);
    readSoftwareV(&serialHandle);
    
    //resetR(&serialHandle);

    CloseComm(serialHandle);
}

// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
