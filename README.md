System Browser Client
==

* [Repository](https://github.com/kyrylo/system_browser_client/)
* [Server][srv]

Description
--

**NOTE:** this is beta software. It contains bugs and sometimes is unresponsive.

System Browser Client is a desktop application that displays information about
Ruby behaviours (classes and modules), its methods and the methods' source
code. _Make sure that you have the [server][srv]_ installed.

![System Browser Client](/screenshots/readme.png)

The browser does not display information about behaviours it real time. That
is, if you launch the browser and define a class after it, the browser won't
display it.

Installation
------------

At the moment System Browser Client is not packaged, so you have to install it
manually. Sorry about that.

### v0.1.0 (July 20, 2015)

1. Install the [server][srv]
1. Select a suitable distribution for your operating system and download it
    * [OSX x32](https://www.dropbox.com/s/8n9d1sz2skau1d5/system-browser-client_osx32.zip?dl=0)
    * [OSX x64](https://www.dropbox.com/s/22l6mzmmztdcd2g/system-browser-client_osx64.zip?dl=0)
    * [GNU/Linux x32](https://www.dropbox.com/s/hnb70xmv9sitp45/system-browser-client_linux32.zip?dl=0)
    * [GNU/Linux x64](https://www.dropbox.com/s/kbn9r5dncb9bczw/system-browser-client_linux64.zip?dl=0)
1.1 For OSX
    * ...
1.1 For GNU/Linux add the `system_browser` executable to your `$PATH` variable.

Licence
-------

The project uses the Zlib License. See LICENCE.txt file for more information.

[srv]:  https://github.com/kyrylo/system_browser_server/
