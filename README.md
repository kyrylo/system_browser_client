System Browser Client
==

* [Repository](https://github.com/kyrylo/system_browser_client/)
* [Server][srv]

Description
--

**NOTE:** this is beta software. It contains bugs and sometimes is unresponsive.

System Browser Client is a desktop application that displays information about
Ruby classes and modules (behaviours), showing both methods and their source
code.

![System Browser Client](/screenshots/readme.png)

The browser does not display information about behaviours it real time. That
is, if you launch the browser and define a class after it, the browser won't
display it.

Installation
------------

At the moment System Browser Client is not packaged, so you have to install it
manually. Sorry about that.

1. Install the [server][srv] (`gem install system_browser`)
1. Select a suitable distribution for your operating system and download it
    * [OSX x32](https://www.dropbox.com/s/8n9d1sz2skau1d5/system-browser-client_osx32.zip?dl=1)
    * [OSX x64](https://www.dropbox.com/s/22l6mzmmztdcd2g/system-browser-client_osx64.zip?dl=1)
    * [GNU/Linux x32](https://www.dropbox.com/s/hnb70xmv9sitp45/system-browser-client_linux32.zip?dl=1)
    * [GNU/Linux x64](https://www.dropbox.com/s/kbn9r5dncb9bczw/system-browser-client_linux64.zip?dl=1)
1. Unzip the downloaded archive
1. Make sure the server can verify that the client is installed
    * For OSX drag the unzipped application to Applications folder
    * For GNU/Linux add the `system_browser` executable to your `$PATH` variable
1. The client is installed and you are ready to work with the server now
1. Important: do not run the client manually (the information will be missing)

Quick test. Start IRB and copy-paste this:

```ruby
require 'system_browser'
SystemBrowser.start
```

Credits
-------

* Big thanks to [@havenwood](https://github.com/havenwood) for helping me
  testing it on OSX

Licence
-------

The project uses the Zlib License. See LICENCE.txt file for more information.

[srv]:  https://github.com/kyrylo/system_browser_server/
