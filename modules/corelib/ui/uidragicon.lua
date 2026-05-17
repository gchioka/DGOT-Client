UIDragIcon = {}
local uiIcon = nil

function UIDragIcon:display(item)
    if modules.client_options.getOption('showDragIcon') then
        if uiIcon == nil then
            uiIcon = g_ui.createWidget('UIDragIcon', rootWidget)
            pcall(function() uiIcon:setVirtual(true) end)
            pcall(function() uiIcon:setShowCount(false) end)
        end

        pcall(function() uiIcon:setItem(item) end)
        uiIcon:show()

        connect(rootWidget, { onMouseMove = onMouseMove })
    end
end

function UIDragIcon:hide()
    if uiIcon ~= nil then
        uiIcon:hide()
        disconnect(rootWidget, { onMouseMove = onMouseMove })
    end
end

function UIDragIcon:destroy()
    if uiIcon ~= nil then
        disconnect(rootWidget, { onMouseMove = onMouseMove })
        uiIcon:destroy()
        uiIcon = nil
    end
end

function onMouseMove(self, mousePos, mouseMoved)
    if uiIcon ~= nil then
        uiIcon:setPosition(mousePos)
    end
end